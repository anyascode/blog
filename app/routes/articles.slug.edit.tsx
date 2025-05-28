import type { Route } from "./+types/route-name";
import { useLocation, useNavigate } from "react-router";
import {
  useGetArticleQuery,
  useUpdateArticleMutation,
} from "~/features/articles/articleService";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import type { RootState } from "~/store";
import {
  ArrowPathIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

export async function loader({ params }: Route.LoaderArgs) {
  const postSlug = params.slug;
  return { postSlug };
}

export default function ArticlesSlugEdit({ loaderData }: Route.ComponentProps) {
  const location = useLocation();
  const article = location.state?.article;
  const { data } = useGetArticleQuery(loaderData?.postSlug, {
    skip: !!article,
  });
  const articleData = article || data?.article;
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);
  const navigate = useNavigate();

  useEffect(() => {
    if (
      articleData &&
      userInfo &&
      userInfo.username !== articleData.author.username
    ) {
      navigate("/articles");
    }
  }, [articleData, userInfo, navigate]);

  const {
    register,
    watch,
    trigger,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [updateArticle, { isLoading, error }] = useUpdateArticleMutation();

  const [tagInputs, setTagInputs] = useState<string[]>(
    articleData?.tagList?.length ? articleData.tagList : [""]
  );
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

  if (error) {
    return (
      <div className="text-red-600 flex flex-row justify-center items-center pt-[251px]">
        <ExclamationCircleIcon className="size-5" />{" "}
        <p className="text-xl">Error</p>
      </div>
    );
  }
  const submitForm = async (data: any) => {
    try {
      const tags = tagInputs.filter((tag) => tag.trim() !== "");
      const result = await updateArticle({
        slug: loaderData.postSlug,
        article: {
          title: data.title,
          description: data.description,
          body: data.body,
          tagList: tags,
        },
      }).unwrap();

      navigate(`/articles/${result.article.slug}`, { replace: true });
    } catch (err) {
      console.log(err);
    }
  };

  if (!articleData) {
    return (
      <div className="text-[#1890FF] flex flex-row justify-center items-center pt-[251px]">
        <ArrowPathIcon className="animate-spin size-5" />
        <p className="text-xl">Loading article...</p>
      </div>
    );
  }

  return (
    <article className="py-[26px] px-[251px]">
      <div className="bg-white py-[48px] px-[32px] shadow-md flex flex-col gap-[25px]">
        <h1 className="font-medium text-center text-xl">Edit article</h1>
        <form
          className="flex flex-col gap-[21px]"
          onSubmit={handleSubmit(submitForm)}
        >
          <div className="flex flex-col gap-[2px]">
            <label>Title </label>

            <input
              type="text"
              className={`text-base px-[16px] py-[8px] border 
                  border-gray-300
               rounded-xs`}
              placeholder="Title"
              defaultValue={articleData?.title}
              {...register("title", {
                required: "Title is required",
              })}
              onBlur={(e) => {
                const value = e.target.value.trim();
                setValue("title", value);
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
              className={`text-base px-[16px] py-[8px] border 
                  border-gray-300
               rounded-xs`}
              placeholder="Title"
              defaultValue={articleData?.description}
              {...register("description", {
                required: "Description is required",
              })}
              onBlur={(e) => {
                const value = e.target.value.trim();
                setValue("description", value);
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
              className={`text-base px-[16px] py-[8px] pb-[129px] border 
                  border-gray-300
               rounded-xs`}
              placeholder="Text"
              defaultValue={articleData?.body}
              {...register("body", {
                required: "Text is required",
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
            {tagInputs?.map((tag, index) => (
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
