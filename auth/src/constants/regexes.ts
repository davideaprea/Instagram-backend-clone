export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const PSW_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,25}$/;

export const NAME_REGEX = /^[\p{L}\p{M}\p{Zs}'\.\-]+$/u;