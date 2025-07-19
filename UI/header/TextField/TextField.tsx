export default function TextField() {
  return (
    <div className="px-3">
      <div className="flex items-center justify-center space-x-5 mt-5">
        <h1 className="text-lg rounded-md bg-gray-100 py-1 px-3 cursor-pointer text-black">
          Write Plain
        </h1>
        <h1 className="text-lg rounded-md bg-gray-100 py-1 px-3 cursor-pointer text-black">
          Write With Editor
        </h1>
      </div>
      <div className="mt-10">
        <h3>Start writing your plaint here</h3>
      </div>
    </div>
  );
}
