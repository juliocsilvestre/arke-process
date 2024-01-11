import {
  ErrorComponent,
  ErrorRouteProps,
  Link,
  NotFoundRoute,
  Outlet,
  RootRoute,
  Route,
  Router,
  RouterProvider,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import axios from "axios";
import ReactDOM from "react-dom/client";

import "./styles/main.css";

type PostType = {
  id: string;
  title: string;
  body: string;
};

const fetchPosts = async () => {
  console.log("Fetching posts...");
  await new Promise((r) => setTimeout(r, 300));
  return axios
    .get<PostType[]>("https://jsonplaceholder.typicode.com/posts")
    .then((r) => r.data.slice(0, 10));
};

const fetchPost = async (postId: string) => {
  console.log(`Fetching post with id ${postId}...`);
  await new Promise((r) => setTimeout(r, 300));
  const post = await axios
    .get<PostType>(`https://jsonplaceholder.typicode.com/posts/${postId}`)
    .catch((err) => {
      if (err.response.status === 404) {
        throw new NotFoundError(`Post with id "${postId}" not found!`);
      }
      throw err;
    })
    .then((r) => r.data);

  return post;
};

const rootRoute = new RootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <div className="bg-gradient-to-r from-green-700 to-lime-600 text-white">
      <div className="p-2 flex gap-2 text-lg bg-black/40 shadow-xl">
        <Link
          to="/"
          activeProps={{
            className: "font-bold",
          }}
          activeOptions={{ exact: true }}
        >
          Home
        </Link>{" "}
        <Link
          to={"/posts"}
          activeProps={{
            className: "font-bold",
          }}
        >
          Posts
        </Link>
      </div>
      <Outlet />
      <TanStackRouterDevtools position="bottom-right" />
    </div>
  );
}
const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/",
  component: IndexComponent,
});

function IndexComponent() {
  return (
    <div className="p-2 bg-red-500">
      <h3>Welcome Home!</h3>
    </div>
  );
}

const postsRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "posts",
  loader: () => fetchPosts(),
  component: PostsComponent,
});

function PostsComponent() {
  const posts = postsRoute.useLoaderData();

  return (
    <div className="p-2 flex gap-2 bg-red">
      <div className="list-disc bg-gray-800/70 rounded-lg divide-y divide-green-500/30">
        {[...posts, { id: "i-do-not-exist", title: "Non-existent Post" }]?.map(
          (post) => {
            return (
              <div key={post.id} className="whitespace-nowrap">
                <Link
                  to={postRoute.to}
                  params={{
                    postId: post.id,
                  }}
                  className="block py-1 px-2 text-green-300 hover:text-green-200"
                  activeProps={{ className: "!text-white font-bold" }}
                >
                  <div>{post.title.substring(0, 20)}</div>
                </Link>
              </div>
            );
          }
        )}
      </div>
      <Outlet />
    </div>
  );
}

const postsIndexRoute = new Route({
  getParentRoute: () => postsRoute,
  path: "/",
  component: PostsIndexComponent,
});

function PostsIndexComponent() {
  return <div>Select a post.</div>;
}

class NotFoundError extends Error {}

const postRoute = new Route({
  getParentRoute: () => postsRoute,
  path: "$postId",
  errorComponent: PostErrorComponent,
  loader: ({ params }) => fetchPost(params.postId),
  component: PostComponent,
});

function PostErrorComponent({ error }: ErrorRouteProps) {
  if (error instanceof NotFoundError) {
    return <div>{error.message}</div>;
  }

  return <ErrorComponent error={error} />;
}

function PostComponent() {
  const post = postRoute.useLoaderData();

  return (
    <div className="space-y-2">
      <h4 className="text-xl font-bold">{post.title}</h4>
      <hr className="opacity-20" />
      <div className="text-sm">{post.body}</div>
    </div>
  );
}

const notFoundRoute = new NotFoundRoute({
  getParentRoute: () => rootRoute,
  component: NotFound,
});

function NotFound() {
  return (
    <div className="p-2">
      <h3>404 - Not Found</h3>
    </div>
  );
}

const routeTree = rootRoute.addChildren([
  postsRoute.addChildren([postRoute, postsIndexRoute]),
  indexRoute,
]);

// Set up a Router instance
const router = new Router({
  routeTree,
  notFoundRoute,
  defaultPreload: "intent",
  defaultStaleTime: 5000,
});

// Register things for typesafety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// biome-ignore lint/style/noNonNullAssertion: This is just an example
const  rootElement = document.getElementById("app")!;

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);

  root.render(<RouterProvider router={router} />);
}
