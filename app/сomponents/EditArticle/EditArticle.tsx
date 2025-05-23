export default function EditArticle() {
  return (
    <article className="py-[26px] px-[251px]">
      <div className="bg-white py-[48px] px-[32px] shadow-md flex flex-col gap-[25px]">
        <h1 className="font-medium text-center text-xl">Create Article</h1>
        <form className="flex flex-col gap-[21px]">
          <div className="flex flex-col gap-[2px]">
            <label>Title </label>

            <input
              type="text"
              className={`text-base px-[16px] py-[8px] border 
                  border-gray-300
               rounded-xs`}
              placeholder="Title"
            />
          </div>
          <div className="flex flex-col gap-[2px]">
            {" "}
            <label>Short description </label>
            <input
              type="text"
              className={`text-base px-[16px] py-[8px] border 
                  border-gray-300
               rounded-xs`}
              placeholder="Title"
            />
          </div>

          <div className="flex flex-col gap-[2px]">
            {" "}
            <label>Text </label>
            <textarea
              className={`text-base px-[16px] py-[8px] pb-[129px] border 
                  border-gray-300
               rounded-xs`}
              placeholder="Text"
            ></textarea>
          </div>
          <div className="flex flex-col gap-[2px]">
            {" "}
            <label>Tags</label>
            <div className="flex flex-row gap-[17px]">
              {" "}
              <input
                type="text"
                className={`text-base px-[16px] py-[8px] border 
                  border-gray-300
               rounded-xs`}
                placeholder="Title"
              />
              <button className="text-center text-red-600 px-[36px] py-[8px] border border-red-600 rounded-xs">
                Delete
              </button>
              <button className="text-center text-[#1890FF] px-[36px] py-[8px] border border-[#1890FF] rounded-xs">
                Add Tag
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="flex flex-row justify-center items-center bg-[#1890FF] text-white p-[8px] text-base rounded-xs "
          >
            Send
          </button>
        </form>
      </div>
    </article>
  );
}
