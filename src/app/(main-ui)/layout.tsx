//Components import
import Navbar from "@/components/Navigation/Navbar";

export default function MainUILayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
        <div>
            {children}
            <Navbar />
        </div>
    );
  }