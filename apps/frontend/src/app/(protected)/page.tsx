"use client";

import { useAuth, useClerk } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import type { hello } from "@/lib/client";
import getRequestClient from "@/lib/getRequestClient";

export default function Page() {
  const { signOut } = useClerk();
  const { getToken, isSignedIn } = useAuth();
  const [data, setData] = useState<hello.Response>();

  useEffect(() => {
    const getResult = async () => {
      const token = await getToken();
      const client = getRequestClient(token ?? undefined);
      const response = await client.hello.get("Saeed");
      setData(response);
    };

    if (isSignedIn) getResult();
  }, [isSignedIn, getToken]);

  return (
    <div className="h-dvh flex justify-center items-center gap-4 flex-col">
      <h1 className="text-2xl font-bold">
        {!data ? "Loading..." : data.message}
      </h1>
      <Button variant="outline" onClick={() => signOut()}>
        Logout
      </Button>
    </div>
  );
}
