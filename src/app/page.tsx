'use client'
import Banner from "@/components/ui/Banner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import { generateImage } from "./actions";
import { useState } from "react";

export default function Home() {
  const [asciiList, setASCIIList] = useState<string[]>([])
  const [style, setStyle] = useState<string>("color")

  let prompt = ""

  function generate() {
    if (prompt == "")
      return
    
    const fetchGeneration = async () => {
      const res = await generateImage(prompt)
      if (!res) {
        console.log("sadge")
      } else {
        setASCIIList([...asciiList, res])
      }
    }
    fetchGeneration()
  }

  return (
    <div className="">
      {/* <div className="w-full flex items-center justify-center h-80 bg-blue-100 text-5xl"> */}
      <div className="w-full flex items-center justify-center h-80 bg-pink-100 text-sm">
        <Banner />
      </div>
      <div className="flex justify-center pt-10 pb-10">
        <div className="w-[80%]">
          <div className="flex justify-center pb-10">
            <div className="flex w-full max-w-sm items-center gap-2">
              <Input placeholder="Enter a prompt..." onChange={(e) => prompt = e.target.value}/>
              <Button type="button" variant="outline" onClick={() => generate()}>
                Generate
              </Button>
              <select name="style" value={style} onChange={(e) => setStyle(e.target.value)}
                className="border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-9 px-4 py-2 has-[>svg]:px-3 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive">
                <option value="color">Colored</option>
                <option value="bw">Black & White</option>
                <option value="rgb">RGB</option>
              </select>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {asciiList.map((ascii, index) => (
              <div key={index} className="flex w-min outline rounded-4xl overflow-hidden justify-center items-center">
                <pre className="text-[4px] whitespace-pre text-center">
                  {ascii}
                </pre>
            </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
