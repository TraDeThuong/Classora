import { useEffect, useState } from "react";
import mammoth from "mammoth";


const DOCX_URL = "https://qawqoxuphgngjtddhqqy.supabase.co/storage/v1/object/public/assignments/PRE%20TEST-2.docx";

export default function DetailAssignment() {
    const [content, setContent] = useState("Loading document...");

      useEffect(() => {
        async function loadDocx() {
        try {
            const response = await fetch(DOCX_URL);

            if (!response.ok) {
            throw new Error("Could not fetch docx file");
            }

            const arrayBuffer = await response.arrayBuffer();

            const result = await mammoth.extractRawText({
            arrayBuffer,
            });

            setContent(result.value);
        } catch (error) {
            console.error(error);
            setContent("Could not load document.");
        }
        }

        loadDocx();
    }, []);
    
  return (
    <div className =" rounded-3xl flex flex-col items-center w-full h-auto gap-10">
        <div className = "flex flex-col gap-2 items-center">
            <div>TITLE</div>
            <div> class: NodeJS for Advanced </div>
            <div> type: quizz </div>
            <div> Due date: 3/6/2026 </div>
            <div> Total score: 10 </div>
            <div> Status: draft</div>
            <div> --------------------------------------</div>
        </div>

            <div className="p-6">
                <div
                    className="
                    min-h-120
                    rounded-2xl border border-white/20
                    bg-white/10 p-6
                    text-brand-500
                    whitespace-pre-wrap
                    "
                >
                    {content}
                </div>
            </div>


    </div>
  )
}
