"use client";

import { ChangeEvent, useState, useRef, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { v4 as uuidv4 } from "uuid";
import { useAccount } from "wagmi";
import { writeContract, watchContractEvent } from "@wagmi/core";
import { toHex, keccak256, decodeEventLog, encodeAbiParameters } from "viem";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CustomConnectButton } from "@/components/ConnectButton";
import { config } from "@/lib/wagmiConfig";
import { TreeDetectorABI } from "../lib/abi";

export default function Home() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [base64Image, setBase64Image] = useState<string>("");
  const [images, setImages] = useState<string[]>([]);
  const [isSending, setIsSending] = useState<boolean>(false);
  const { toast } = useToast();
  const { address, isConnected } = useAccount();
  const pendingHashesRef = useRef<Set<string>>(new Set());
  
  const contractAddress = process.env.NEXT_PUBLIC_COPROCESSOR_ADAPTER as `0x${string}`;
  const tokenContract = process.env.NEXT_PUBLIC_TOKEN_CONTRACT;

  const imageToBase64 = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result?.toString().split(",")[1] || "");
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }, []);

  useEffect(() => {
    const unwatch = watchContractEvent(config, {
      abi: TreeDetectorABI,
      address: contractAddress,
      eventName: "ResultReceived",
      onLogs: (logs) => {
        logs.forEach((log) => {
          try {
            const decoded = decodeEventLog({ abi: TreeDetectorABI, eventName: "ResultReceived", data: log.data, topics: log.topics });
            const { payloadHash, imageHash } = decoded.args as unknown as { payloadHash: string; imageHash: string };
            
            const normalizedHash = payloadHash.toLowerCase();
            if (pendingHashesRef.current.has(normalizedHash)) {
              setImages((prev) => [...prev, `http://localhost:3034/get_preimage/2/${imageHash.slice(2)}`]);
              pendingHashesRef.current.delete(normalizedHash);
            }
          } catch (error) {
            console.error("Error decoding event:", error);
          }
        });
      },
    });
    return () => unwatch();
  }, [contractAddress]);

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      try {
        setBase64Image(await imageToBase64(file));
      } catch {
        toast({ title: "Error", description: "Failed to convert image.", variant: "destructive" });
      }
    }
  };

  const createJsonRequest = useMemo(() => () => ({ token_contract: tokenContract, entropy: uuidv4(), base64_image: base64Image }), [base64Image, tokenContract]);

  const sendTransaction = useCallback(async () => {
    if (!address) return;
    const jsonPayload = createJsonRequest();
    const hexData = toHex(JSON.stringify(jsonPayload));
    const encodedPayload = encodeAbiParameters([{ type: "address" }, { type: "bytes" }], [address, hexData]);
    const payloadHash = keccak256(encodedPayload).toLowerCase();
    pendingHashesRef.current.add(payloadHash);
    
    try {
      await writeContract(config, { address: contractAddress, abi: TreeDetectorABI, functionName: "runExecution", args: [hexData] });
      toast({ title: "Transaction sent", description: "Waiting for response..." });
    } catch (error) {
      console.error("Transaction error:", error);
      pendingHashesRef.current.delete(payloadHash);
      toast({ title: "Transaction Error", description: error instanceof Error ? error.message : "Transaction failed", variant: "destructive" });
    }
  }, [address, contractAddress, createJsonRequest]);

  const handleSendImage = async () => {
    if (!base64Image) return toast({ title: "Error", description: "No image selected", variant: "destructive" });
    if (!isConnected) return toast({ title: "Wallet not connected", description: "Connect your wallet to proceed.", variant: "destructive" });
    
    setIsSending(true);
    await sendTransaction();
    setIsSending(false);
  };

  return (
    <div className="h-screen">
      <div className="flex p-4 justify-end">
        <div className="flex flex-col gap-2 items-center">
          <CustomConnectButton />
          <p>
            Get test tokens on the faucet{" "}
            <Link className="underline" href="https://cloud.google.com/application/web3/faucet/ethereum/holesky">here</Link>
          </p>
        </div>
      </div>
      <div className="justify-items-center my-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <p className="font-semibold text-2xl mb-4">Tree Image Detector</p>
        <div className="flex flex-col gap-6">
          {imagePreview && (
            <div className="mt-4 flex flex-col items-center">
              <p className="mb-1 text-lg font-semibold">Image Preview:</p>
              <Image src={imagePreview} alt="Image preview" width={340} height={300} className="border border-gray-200 rounded-md shadow-sm" />
            </div>
          )}
          <input className="border border-dashed border-gray-500 py-2 px-3 rounded-md cursor-pointer text-sm" type="file" accept="image/*" onChange={handleImageChange} />
          <Button disabled={isSending} className="w-full mb-8" onClick={handleSendImage}>{isSending ? "Sending..." : "Send"}</Button>
          {images.length > 0 && (
            <div className="flex flex-col items-center">
              <p className="text-lg font-semibold">Results:</p>
              {[...images].reverse().map((image, index) => (
                <Image key={index} src={image} alt={`Result ${index}`} width={340} height={300} className="border border-gray-200 rounded-md shadow-sm my-4" />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
