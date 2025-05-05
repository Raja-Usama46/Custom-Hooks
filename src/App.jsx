import React, { useState } from "react";
import useGetRequest from "./hooks/useGetRequest";
import usePostRequest from "./hooks/usePostRequest";
import usePutRequest from "./hooks/usePutRequest";
import usePatchRequest from "./hooks/usePatchRequest";
import useDeleteRequest from "./hooks/useDeleteRequest";

const App = () => {
  const {
    data: posts,
    loading: loadingGet,
    error: errorGet,
  } = useGetRequest("https://jsonplaceholder.typicode.com/posts");

  const {
    execute: postRequest,
    data: newPost,
    error: errorPost,
  } = usePostRequest();

  const {
    execute: putRequest,
    data: updatedPost,
    error: errorPut,
  } = usePutRequest();

  const {
    execute: patchRequest,
    data: patchedPost,
    error: errorPatch,
  } = usePatchRequest();

  const {
    execute: deleteRequest,
    data: deletedPost,
    error: errorDelete,
  } = useDeleteRequest();

  const [loadingStates, setLoadingStates] = useState({
    put: {},
    patch: {},
    delete: {},
  });

  const handleAdd = () =>
    postRequest("https://jsonplaceholder.typicode.com/posts", {
      title: "New Post",
      body: "Content...",
      userId: 101,
    });

  const handleAction = async (action, id, requestFn) => {
    setLoadingStates((prev) => ({
      ...prev,
      [action]: { ...prev[action], [id]: true },
    }));

    try {
      await requestFn();
    } finally {
      setLoadingStates((prev) => ({
        ...prev,
        [action]: { ...prev[action], [id]: false },
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          Blog Posts Manager
        </h1>

        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold text-gray-800">Posts</h2>
          <button
            onClick={handleAdd}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
          >
            <PlusIcon />
            Create Post
          </button>
        </div>

        {errorPost && <ErrorAlert message={`POST Error: ${errorPost}`} />}
        {errorGet && <ErrorAlert message={`GET Error: ${errorGet}`} />}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {loadingGet && <LoadingSpinner />}

          {posts?.slice(0, 11).map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6"
            >
              <div className="h-full flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 line-clamp-3 mb-4">{post.body}</p>
                </div>

                <div className="flex gap-3 justify-end">
                  <ActionButton
                    onClick={() =>
                      handleAction("put", post.id, () =>
                        putRequest(
                          `https://jsonplaceholder.typicode.com/posts/${post.id}`,
                          {
                            id: post.id,
                            title: "Updated",
                            body: "Updated content",
                            userId: 1,
                          }
                        )
                      )
                    }
                    loading={loadingStates.put[post.id]}
                    label="PUT"
                    color="blue"
                  />
                  <ActionButton
                    onClick={() =>
                      handleAction("patch", post.id, () =>
                        patchRequest(
                          `https://jsonplaceholder.typicode.com/posts/${post.id}`,
                          { title: "Patched Title" }
                        )
                      )
                    }
                    loading={loadingStates.patch[post.id]}
                    label="PATCH"
                    color="yellow"
                  />
                  <ActionButton
                    onClick={() =>
                      handleAction("delete", post.id, () =>
                        deleteRequest(
                          `https://jsonplaceholder.typicode.com/posts/${post.id}`
                        )
                      )
                    }
                    loading={loadingStates.delete[post.id]}
                    label="DELETE"
                    color="red"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <section className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Results</h2>
          <div className="space-y-4">
            <ResultItem data={newPost} label="Created Post" color="green" />
            <ResultItem data={updatedPost} label="Updated Post" color="blue" />
            <ResultItem
              data={patchedPost}
              label="Patched Post"
              color="yellow"
            />
            {deletedPost && (
              <ResultItem
                data={{ message: "Post deleted successfully" }}
                label="Deleted Post"
                color="red"
              />
            )}
            {errorPut && <ErrorAlert message={`PUT Error: ${errorPut}`} />}
            {errorPatch && (
              <ErrorAlert message={`PATCH Error: ${errorPatch}`} />
            )}
            {errorDelete && (
              <ErrorAlert message={`DELETE Error: ${errorDelete}`} />
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

const PlusIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4v16m8-8H4"
    />
  </svg>
);

const LoadingSpinner = () => (
  <div className="col-span-full text-center py-8">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto" />
    <p className="mt-4 text-gray-600">Loading posts...</p>
  </div>
);

const ErrorAlert = ({ message }) => (
  <div className="bg-red-50 text-red-700 p-4 rounded-lg">{message}</div>
);

const ActionButton = ({ onClick, loading, label, color }) => {
  const colors = {
    blue: "bg-blue-600 hover:bg-blue-700",
    yellow: "bg-yellow-600 hover:bg-yellow-700",
    red: "bg-red-600 hover:bg-red-700",
  };

  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-white rounded-md text-sm font-medium transition-colors disabled:opacity-50 ${colors[color]}`}
      disabled={loading}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <Spinner />
          {label}
        </span>
      ) : (
        label
      )}
    </button>
  );
};

const Spinner = () => (
  <svg
    className="animate-spin h-4 w-4 text-white"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

const ResultItem = ({ data, label, color }) => {
  const colors = {
    green: "bg-green-50 text-green-700",
    blue: "bg-blue-50 text-blue-700",
    yellow: "bg-yellow-50 text-yellow-700",
    red: "bg-red-50 text-red-700",
  };

  return (
    data && (
      <div className={`p-4 rounded-lg ${colors[color]}`}>
        <p>
          <span className="font-medium">{label}:</span>{" "}
          {data.message || JSON.stringify(data)}
        </p>
      </div>
    )
  );
};

export default App;
