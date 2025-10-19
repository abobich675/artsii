'use client'
import Banner from "@/components/ui/Banner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import { generateImage } from "./actions";
import { useState } from "react";
import { toast } from "sonner";
import FormattedAscii from "@/components/ui/FormattedAscii";
import { Loader2 } from "lucide-react";
import Image from "next/image";

type ColoredChar = {
  char: string;
  color: string;
};

type RGBLayers = {
  red: string[][];
  green: string[][];
  blue: string[][];
};

type AsciiAndType = {
  ascii: string | ColoredChar[][] | RGBLayers;
  style: string;
}

export default function Home() {
  
  const [asciiList, setASCIIList] = useState<AsciiAndType[]>([])
  const [style, setStyle] = useState<string>("bw")
  const [loading, setLoading] = useState(false)
  const [prompt, setPrompt] = useState("")

  function generate() {
    if (prompt == "")
      return
    
    const fetchGeneration = async () => {
      setLoading(true)
      const currStyle = style
      const res = await generateImage(prompt, style)
      if (!res) {
        toast.error("Failed to generate image")
      } else {
        setASCIIList([...asciiList, {ascii:res, style: currStyle}])
      }
      setLoading(false)
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
        <div className="w-[90%]">
          <div className="flex w-full justify-center gap-5">
            <div>
              hello
            </div>
            <div>
              <div className="flex w-max items-center gap-2">
                <Input className="w-100" placeholder="ASCII Image Prompt..." value={prompt} onChange={(e) => setPrompt(e.target.value || "")}/>
                <select name="style" value={style} onChange={(e) => setStyle(e.target.value)}
                  className="border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-9 px-4 py-2 has-[>svg]:px-3 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive">
                  <option value="bw">Black & White</option>
                  <option value="color">Colored</option>
                  <option value="rgb">RGB</option>
                </select>
              </div>
              <div className="flex justify-center pb-10 pt-2">
                <Button className="w-138" type="button" variant="outline" disabled={loading} onClick={() => generate()}>
                  {loading ? (
                    <Loader2 size={20} className="animate-spin mx-auto" />
                  ) : (
                    "Generate"
                  )}
                </Button>
              </div>
            </div>
            <Image src="/alphabet_blocks.svg" alt="Alphabet blocks" width={200} height={200}/>
          </div>
          <div className="flex flex-wrap gap-5 justify-center">
            {[...asciiList].reverse().map((ascii, index) => (
              <div key={index} className="flex w-min outline rounded-4xl overflow-hidden justify-center items-center">
                <pre className="text-[3px] whitespace-pre text-center">
                  <FormattedAscii style={ascii["style"]}>{ascii["ascii"]}</FormattedAscii>
                </pre>
            </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
