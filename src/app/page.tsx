'use client'
import Banner from "@/components/ui/Banner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import { generateImage } from "./actions";
import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const [imagePath, setImagePath] = useState<string>("")

  let prompt = ""

  function generate() {
    if (prompt == "")
      return
    
    const fetchGeneration = async () => {
      const res = await generateImage(prompt)
      if (!res) {
        console.log("sadge")
      } else {
        setImagePath(res)
      }
    }
    fetchGeneration()
    console.log("generation requested")
  }

  return (
    <div className="">
      {/* <div className="w-full flex items-center justify-center h-80 bg-blue-100 text-5xl"> */}
      <div className="w-full flex items-center justify-center h-80 bg-blue-100 text-sm">
        <Banner />
      </div>
      <div className="flex justify-center pt-10 pb-10">
        <div className="w-[80%]">
          <div className="flex justify-center pb-10">
            <div className="flex w-full max-w-sm items-center gap-2">
              <Input placeholder="ASCII Image Prompt..." onChange={(e) => prompt = e.target.value}/>
              <Button type="button" variant="outline" onClick={() => generate()}>
                Generate
              </Button>
            </div>
          </div>
          <div className="h-150 outline rounded-4xl overflow-hidden">
            {imagePath ? (
              imagePath // <Image src={imagePath} alt={"Generated Image: " + prompt} />
              ):(
                  "empty"
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
