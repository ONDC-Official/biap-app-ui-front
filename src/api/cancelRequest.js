import { useRef, useEffect } from "react";
import { makeCancelable } from "./axios";

export default function useCancellablePromise() {
  // REFS
  const promises = useRef([]);

  useEffect(() => {
    promises.current = [];
    return function cancel() {
      promises.current.forEach((p) => p.cancel());
      promises.current = [];
    };
  }, []);

  function cancellablePromise(p) {
    const cancelAblePromise = makeCancelable(p);
    promises.current.push(cancelAblePromise);
    return cancelAblePromise.promise;
  }
  return { cancellablePromise };
}
