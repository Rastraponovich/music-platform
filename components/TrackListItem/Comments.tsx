import clsx from "clsx"
import React, { memo, FC, useState } from "react"
import Comment from "./Comment"

interface CommentsProps {
    opened: boolean
    comments: any[]
}

const Comments: FC<CommentsProps> = ({ opened, comments }) => {
    const [focus, setFocus] = useState(false)
    return (
        <div
            className={clsx(
                "static z-10 flex max-h-full transform flex-col space-y-2 overflow-hidden border bg-white transition-[opacity_transform_height_padding] duration-200",
                opened ? "opacity-1 h-full translate-y-0 pt-5" : "h-0 -translate-y-full opacity-0"
            )}
        >
            {comments.map((comment) => (
                <Comment key={comment.id} />
            ))}

            {comments.length <= 0 && (
                <div className="text-center italic text-gray-600 first-letter:uppercase">
                    <span>пока нет комментариев</span>
                </div>
            )}

            <form
                onSubmit={(e) => e.preventDefault()}
                className="flex flex-col space-y-2  border-t border-t-gray-300 p-4"
            >
                <label htmlFor="">
                    <span
                        className={clsx(
                            "text-md text-gray-500 first-letter:capitalize",
                            focus && "text-black"
                        )}
                    >
                        Новое сообщение
                    </span>
                </label>
                <textarea
                    className="resize-none rounded border border-gray-300 p-2 text-sm"
                    rows={3}
                    onFocus={() => setFocus((prev) => !prev)}
                />
                <button type="submit" className="btn btn-xs self-start">
                    Отправить
                </button>
            </form>
        </div>
    )
}

export default memo(Comments)
