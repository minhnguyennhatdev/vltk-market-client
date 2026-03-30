export const DefaultLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen w-full flex-col bg-white">
      <div className="flex min-h-0 w-full flex-1 flex-col">
        {children}
      </div>
    </div>
  );
};