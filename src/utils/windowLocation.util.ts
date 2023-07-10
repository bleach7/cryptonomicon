export const saveStateToWindowLocation = ({
  searchQuery,
  currentPage,
}: {
  searchQuery: string;
  currentPage: number;
}) => {
  if (window) {
    window.history.pushState(
      null,
      document.title,
      `${window.location.pathname}?search=${searchQuery}&page=${currentPage}`
    );
  }
};
