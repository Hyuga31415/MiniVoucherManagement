/**
 * Voucher Entity - Represents a promotional voucher in the system
 * Matches API response: { code, createdAt, discountPercent, expiredDate, id, quantity, status }
 */
export class Voucher {
  id?: number;
  code: string;
  discountPercent: number;
  quantity: number;
  expiredDate: string; // ISO 8601 format: YYYY-MM-DD
  status: string; // e.g., "ACTIVE", "EXPIRED", "INACTIVE"
  createdAt?: string;

  constructor(
    code: string,
    discountPercent: number,
    quantity: number,
    expiredDate: string,
    status: string = "ACTIVE",
    id?: number,
    createdAt?: string
  ) {
    this.id = id;
    this.code = code;
    this.discountPercent = discountPercent;
    this.quantity = quantity;
    this.expiredDate = expiredDate;
    this.status = status;
    this.createdAt = createdAt;
  }

  /**
   * Validate voucher business rules
   * Returns array of validation errors (empty if valid)
   */
  validate(): string[] {
    const errors: string[] = [];

    if (!this.code?.trim()) {
      errors.push("Code is required");
    }

    if (this.discountPercent < 1 || this.discountPercent > 100) {
      errors.push("Discount percent must be between 1 and 100");
    }

    if (this.quantity < 0) {
      errors.push("Quantity must be greater than or equal to 0");
    }

    const expiredDate = new Date(this.expiredDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (expiredDate <= today) {
      errors.push("Expired date must be greater than today");
    }

    return errors;
  }

  /**
   * Check if voucher is still valid (not expired)
   */
  isValid(): boolean {
    const expiredDate = new Date(this.expiredDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return expiredDate > today && this.status === "ACTIVE";
  }

  /**
   * Check if voucher has sufficient quantity
   */
  hasAvailableQuantity(): boolean {
    return this.quantity > 0;
  }
}
