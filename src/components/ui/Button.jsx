export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-royal/40";
  const variants = {
    primary:
      "bg-royal text-white shadow-sm hover:bg-royal-dark hover:shadow-md",
    secondary:
      "bg-navy text-white hover:bg-navy-light shadow-sm hover:shadow-md",
    outline:
      "border border-silver-dark bg-white text-navy hover:border-royal hover:text-royal",
    ghost: "text-navy hover:bg-silver-light",
  };
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-sm",
    lg: "px-7 py-3 text-base",
  };
  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
