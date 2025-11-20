export default function Unauthorized() {
  return (
    <div className="flex items-center justify-center h-screen">
      <h1 className="text-xl font-bold text-red-600">
        You do not have permission to access this page.
      </h1>
    </div>
  );
}
