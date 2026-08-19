"use client"

import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { searchSelector } from "./lib/features/searchSlice";
import { addSuggestion } from "./lib/features/suggestionSlice";
import { useEffect } from "react";



export default function Home() {

  const search = useSelector(searchSelector) 
  const dispatch = useDispatch()
  

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
      RADIO TUNE
      </main>
    </div>
  );
}
