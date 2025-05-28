import { useCreateArticleMutation } from "../features/articles/articleService";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export default function NewArticle() {
  const [createArticle, { isLoading }] = useCreateArticleMutation();
  const {
    register,
    watch,
    trigger,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const [tagInputs, setTagInputs] = useState<string[]>([""]);
  const addTagInput = () => {
    setTagInputs([...tagInputs, ""]);
  };

  const removeTagInput = (index: number) => {
    setTagInputs(tagInputs.filter((_, i) => i !== index));
  };

  const updateTag = (index: number, value: string) => {
    const newTags = [...tagInputs];
    newTags[index] = value;
    setTagInputs(newTags);
  };

  const submitForm = async (data: any) => {
    try {
      const tags = tagInputs.filter((tag) => tag.trim() !== "");
      await createArticle({ ...data, tagList: tags }).unwrap();
      navigate("/articles");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <article className="py-[26px] px-[251px]">
      <div className="bg-white py-[48px] px-[32px] shadow-md flex flex-col gap-[25px]">
        <h1 className="font-medium text-center text-xl">Create new article</h1>
        <form
          className="flex flex-col gap-[21px]"
          onSubmit={handleSubmit(submitForm)}
        >
          <div className="flex flex-col gap-[2px]">
            <label>Title </label>

            <input
              type="text"
              className={`text-lg px-[16px] py-[8px] border 
              border-gray-300
           rounded-xs`}
              placeholder="Title"
              {...register("title", {
                required: "Title is required",
                validate: () => {
                  if (watch("title").trim().length === 0) {
                    return `Field shouldn't be empty`;
                  }
                },
              })}
              onBlur={(e) => {
                setValue("title", e.target.value);
                trigger("title");
              }}
            />
            {errors.title && (
              <p className="text-red-500">{errors.title.message?.toString()}</p>
            )}
          </div>
          <div className="flex flex-col gap-[2px]">
            {" "}
            <label>Short description </label>
            <input
              type="text"
              className={`text-lg px-[16px] py-[8px] border 
              border-gray-300
           rounded-xs`}
              placeholder="Title"
              {...register("description", {
                required: "Description is required",
                validate: () => {
                  if (watch("description").trim().length === 0) {
                    return `Field shouldn't be empty`;
                  }
                },
              })}
              onBlur={(e) => {
                setValue("description", e.target.value);
                trigger("description");
              }}
            />
            {errors.description && (
              <p className="text-red-500">
                {errors.description.message?.toString()}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-[2px]">
            {" "}
            <label>Text </label>
            <textarea
              className={`text-lg px-[16px] py-[8px] pb-[129px] border 
              border-gray-300
           rounded-xs`}
              placeholder="Text"
              {...register("body", {
                required: "Text is required",
                validate: () => {
                  if (watch("body").trim().length === 0) {
                    return `Field shouldn't be empty`;
                  }
                },
              })}
              onBlur={(e) => {
                const value = e.target.value.trim();
                setValue("body", value);
                trigger("body");
              }}
            ></textarea>
            {errors.body && (
              <p className="text-red-500">{errors?.body.message?.toString()}</p>
            )}
          </div>
          <div className="flex flex-col gap-[2px]">
            {" "}
            <label>Tags</label>
            <div className="flex flex-col gap-[10px]">
              {tagInputs.map((tag, index) => (
                <div key={index} className="flex flex-row gap-[17px]">
                  <input
                    type="text"
                    className={`text-lg px-[16px] py-[8px] border 
                      border-gray-300
                      rounded-xs`}
                    placeholder="Tag"
                    value={tag}
                    onChange={(e) => updateTag(index, e.target.value)}
                  />
                  <button
                    type="button"
                    className="text-center text-red-600 px-[36px] py-[8px] border border-red-600 rounded-xs"
                    onClick={() => removeTagInput(index)}
                  >
                    Delete
                  </button>
                  {index === tagInputs.length - 1 && (
                    <button
                      type="button"
                      className="text-center text-[#1890FF] px-[36px] py-[8px] border border-[#1890FF] rounded-xs"
                      onClick={addTagInput}
                    >
                      Add Tag
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
          <button
            type="submit"
            className="flex flex-row justify-center items-center bg-[#1890FF] text-white p-[8px] text-base rounded-xs "
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                {" "}
                <ArrowPathIcon className="animate-spin size-[14px] " />{" "}
                <span>Sending...</span>
              </>
            ) : (
              <>
                <span>Send</span>
              </>
            )}
          </button>
        </form>
      </div>
    </article>
  );
}
