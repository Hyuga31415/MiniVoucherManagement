/**
 * User Entity - Represents a user in the system
 * Matches API response: { createdAt, email, fullName, id, phone }
 */
export class User {
  id?: number;
  fullName: string;
  email: string;
  phone?: string;
  createdAt?: string;

  constructor(
    fullName: string,
    email: string,
    phone?: string,
    id?: number,
    createdAt?: string
  ) {
    this.id = id;
    this.fullName = fullName;
    this.email = email;
    this.phone = phone;
    this.createdAt = createdAt;
  }

  /**
   * Validate user business rules
   * Returns array of validation errors (empty if valid)
   */
  validate(): string[] {
    const errors: string[] = [];

    if (!this.fullName?.trim()) {
      errors.push("Full name is required");
    }

    if (!this.email?.trim()) {
      errors.push("Email is required");
    } else if (!this.isValidEmail(this.email)) {
      errors.push("Email format is invalid");
    }

    if (this.phone && !this.isValidPhone(this.phone)) {
      errors.push("Phone format is invalid");
    }

    return errors;
  }

  /**
   * Validate email format using regex
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate phone format (optional, basic check)
   */
  private isValidPhone(phone: string): boolean {
    const phoneRegex = /^[0-9]{10,}$/;
    return phoneRegex.test(phone.replace(/[\s\-()]/g, ""));
  }
}
