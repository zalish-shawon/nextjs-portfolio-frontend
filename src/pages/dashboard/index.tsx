import Link from "next/link";
import { User, FolderGit2, Newspaper } from "lucide-react";

export default function DashboardHome() {
  const cards = [
    {
      title: "About Me",
      description: "Manage personal information, skills, and work experience",
      href: "/dashboard/about/about",
      icon: <User className="w-8 h-8 text-blue-600" />,
      color: "from-blue-50 to-blue-100",
    },
    {
      title: "Projects",
      description: "Add or edit projects with live and repo links",
      href: "/dashboard/projects/projects",
      icon: <FolderGit2 className="w-8 h-8 text-green-600" />,
      color: "from-green-50 to-green-100",
    },
    {
      title: "Blogs",
      description: "Create and manage technical blogs",
      href: "/dashboard/blogs/blogs",
      icon: <Newspaper className="w-8 h-8 text-purple-600" />,
      color: "from-purple-50 to-purple-100",
    },
  ];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {cards.map((card) => (
          <Link key={card.title} href={card.href}>
            <div className={`bg-gradient-to-br ${card.color} p-6 rounded-2xl shadow-md hover:shadow-xl transition cursor-pointer`}>
              <div className="flex items-center gap-4 mb-3">
                {card.icon}
                <h2 className="text-xl font-semibold">{card.title}</h2>
              </div>
              <p className="text-gray-600 text-sm">{card.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
