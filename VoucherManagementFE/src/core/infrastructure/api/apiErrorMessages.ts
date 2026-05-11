type ApiErrorOptions = {
  status?: number;
  bodyText?: string | null;
  fallback: string;
  notFoundMessage: string;
};

const STATUS_MESSAGES: Record<number, string> = {
  400: "Yêu cầu không hợp lệ. Vui lòng kiểm tra lại thông tin.",
  401: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
  403: "Bạn không có quyền thực hiện thao tác này.",
  404: "Không tìm thấy dữ liệu.",
  409: "Dữ liệu đã tồn tại.",
  422: "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.",
  500: "Máy chủ đang gặp lỗi. Vui lòng thử lại sau.",
  502: "Máy chủ tạm thời không phản hồi.",
  503: "Hệ thống đang bảo trì. Vui lòng thử lại sau.",
};

const NOT_FOUND_PATTERNS = [
  "not found",
  "không tìm thấy",
  "không tồn tại",
  "no longer available",
  "does not exist",
  "voucher not found",
];

const TECHNICAL_PATTERNS = ["http error", "status ", "unexpected token", "failed to fetch"];

function isNotFoundMessage(message: string): boolean {
  const lower = message.toLowerCase();
  return NOT_FOUND_PATTERNS.some((pattern) => lower.includes(pattern));
}

function isTechnicalMessage(message: string): boolean {
  const lower = message.toLowerCase();
  return TECHNICAL_PATTERNS.some((pattern) => lower.includes(pattern));
}

function statusMessage(status: number | undefined, notFoundMessage: string): string | undefined {
  if (typeof status !== "number") return undefined;
  if (status === 404) return notFoundMessage;
  return STATUS_MESSAGES[status];
}

/**
 * Convert raw API or HTTP errors into user-friendly Vietnamese messages.
 */
export function toFriendlyApiErrorMessage({
  status,
  bodyText,
  fallback,
  notFoundMessage,
}: ApiErrorOptions): string {
  const fallbackMessage = statusMessage(status, notFoundMessage) || fallback;

  if (!bodyText) {
    return fallbackMessage;
  }

  try {
    const parsed = JSON.parse(bodyText);
    const rawMessage = String(parsed?.message ?? parsed?.error ?? bodyText).trim();

    if (!rawMessage) {
      return fallbackMessage;
    }

    if (isNotFoundMessage(rawMessage)) {
      return notFoundMessage;
    }

    if (isTechnicalMessage(rawMessage)) {
      return fallbackMessage;
    }

    return rawMessage;
  } catch {
    const rawMessage = bodyText.trim();

    if (!rawMessage) {
      return fallbackMessage;
    }

    if (isNotFoundMessage(rawMessage)) {
      return notFoundMessage;
    }

    if (isTechnicalMessage(rawMessage)) {
      return fallbackMessage;
    }

    return rawMessage;
  }
}