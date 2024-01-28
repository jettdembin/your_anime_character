"use client";

import { GET_CHARACTER } from "@/graphql/queries";
import { useAnilistAPI } from "@/hooks/useAnilistAPI";

type Props = {};

export default function Form({}: Props) {
  const { error, loading, data } = useAnilistAPI(GET_CHARACTER);
  if (loading) return "loading...";
  if (error) {
    console.log(error, "error");
    return <p>Error: {error.message}</p>;
  }

  return <div>Form</div>;
}
