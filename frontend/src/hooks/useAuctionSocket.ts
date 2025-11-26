import { useEffect, useRef, useState } from "react";
import webSocketService from "../services/websocket";

/**
 * Custom hook for auction real-time updates
 */
export const useAuctionSocket = (auctionId: string | null) => {
  const [isConnected, setIsConnected] = useState(false);
  const [currentBid, setCurrentBid] = useState<number | null>(null);
  const [auctionState, setAuctionState] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<any>(null);

  useEffect(() => {
    if (!auctionId) return;

    // Connect to WebSocket
    const socket = webSocketService.connect();
    socketRef.current = socket;

    // Join auction room
    socket.emit("join_auction", auctionId);

    // Listen for connection status
    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    // Listen for auction state updates
    const handleAuctionState = (data: {
      auctionId: string;
      state: string;
      currentBid: number | null;
      endAt: string;
    }) => {
      if (data.auctionId === auctionId) {
        setAuctionState(data.state);
        setCurrentBid(data.currentBid);
        // Calculate time left
        const endTime = new Date(data.endAt).getTime();
        const now = Date.now();
        setTimeLeft(Math.max(0, endTime - now));
      }
    };

    // Listen for new bids
    const handleNewBid = (data: {
      auctionId: string;
      bid: { amountMinor: number };
    }) => {
      if (data.auctionId === auctionId) {
        setCurrentBid(data.bid.amountMinor);
      }
    };

    // Listen for bid success/error
    const handleBidSuccess = () => {
      setError(null);
    };

    const handleBidError = (data: { error: string }) => {
      setError(data.error);
    };

    socket.on("auction_state", handleAuctionState);
    socket.on("new_bid", handleNewBid);
    socket.on("bid_success", handleBidSuccess);
    socket.on("bid_error", handleBidError);

    // Update time left periodically
    const timeInterval = setInterval(() => {
      if (timeLeft !== null && timeLeft > 0) {
        setTimeLeft((prev) =>
          prev !== null ? Math.max(0, prev - 1000) : null
        );
      }
    }, 1000);

    // Cleanup
    return () => {
      if (socket && auctionId) {
        socket.emit("leave_auction", auctionId);
        socket.off("connect", handleConnect);
        socket.off("disconnect", handleDisconnect);
        socket.off("auction_state", handleAuctionState);
        socket.off("new_bid", handleNewBid);
        socket.off("bid_success", handleBidSuccess);
        socket.off("bid_error", handleBidError);
      }
      clearInterval(timeInterval);
    };
  }, [auctionId, timeLeft]);

  /**
   * Place a bid
   */
  const placeBid = (amountMinor: number) => {
    if (!auctionId || !socketRef.current) {
      setError("Not connected to auction");
      return;
    }

    setError(null);
    socketRef.current.emit("place_bid", {
      auctionId,
      amountMinor,
      userId: JSON.parse(localStorage.getItem("user") || "{}").id,
    });
  };

  return {
    isConnected,
    currentBid,
    auctionState,
    timeLeft,
    error,
    placeBid,
  };
};
