export const shortenHex = (address: string, length = 4) =>
  `${address.substring(0, 2 + length)}...${address.substring(
    address.length - length,
    address.length
  )}`;
