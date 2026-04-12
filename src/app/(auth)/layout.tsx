export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-[calc(100vh-120px)] flex items-center justify-center px-4 py-16 warm-gradient">
      {children}
    </div>
  );
}
