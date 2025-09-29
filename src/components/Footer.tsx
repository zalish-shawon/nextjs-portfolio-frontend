export default function Footer() {
  return (
    <footer className="mt-8 bg-white border-t">
      <div className="max-w-5xl mx-auto px-4 py-4 text-sm text-center text-gray-500">
        © {new Date().getFullYear()} My Portfolio — Built with Zalish Mahmud
      </div>
    </footer>
  );
}