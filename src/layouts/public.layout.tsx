import { Footer } from "@/components/footer/Footer";
import { Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

export const PublicLayout = (): JSX.Element => {
    return (
        <main className="flex">
            {/* TODO: Add public header */}
            <aside className="bg-black text-white w-40 flex justify-center items-center">
                <h1>Public</h1>
            </aside>
            <Outlet />
            <TanStackRouterDevtools position="bottom-right" />
            <Footer />
        </main>
    );
};
