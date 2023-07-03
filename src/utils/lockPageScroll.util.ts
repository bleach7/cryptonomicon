export const lockPageScroll = (isLocking: boolean) => {
  const body = document.body;

  if (isLocking) {
    if (body) {
      body.style.overflow = "hidden";
    }
  }

  if (!isLocking) {
    if (body) {
      body.style.overflow = "visible";
    }
  }
};
