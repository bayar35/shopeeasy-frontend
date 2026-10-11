import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// ⭐ Test бүрийн дараа cleanup
afterEach(() => {
  cleanup();
});