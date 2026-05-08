/**
 * VoucherUsage Entity - Represents a usage record of a voucher
 * Matches API response: { id, usedAt, userId, voucherId }
 */
export class VoucherUsage {
  id?: number;
  userId: number;
  voucherId: number;
  usedAt?: string; // ISO 8601 format: YYYY-MM-DDTHH:mm:ss

  constructor(
    userId: number,
    voucherId: number,
    id?: number,
    usedAt?: string
  ) {
    this.id = id;
    this.userId = userId;
    this.voucherId = voucherId;
    this.usedAt = usedAt;
  }

  /**
   * Validate voucher usage business rules
   * Returns array of validation errors (empty if valid)
   */
  validate(): string[] {
    const errors: string[] = [];

    if (!this.userId || this.userId <= 0) {
      errors.push("Valid user ID is required");
    }

    if (!this.voucherId || this.voucherId <= 0) {
      errors.push("Valid voucher ID is required");
    }

    return errors;
  }

  /**
   * Format usage date for display
   */
  getFormattedDate(): string {
    if (!this.usedAt) return "";
    const date = new Date(this.usedAt);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }
}
