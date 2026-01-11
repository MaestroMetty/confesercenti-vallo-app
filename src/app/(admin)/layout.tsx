import { redirect } from 'next/navigation';

//Components import
import AdminNavbar from '@/components/Navigation/AdminNavbar';

//Functions import
import { verifyLogin } from '@/lib/verifyLogin';

export default async function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    const verifiedToken = await verifyLogin();
    if (!verifiedToken) {
        redirect('/login');
    }
    return (
        <div>
            <AdminNavbar />
            {children}
        </div>
    );
}