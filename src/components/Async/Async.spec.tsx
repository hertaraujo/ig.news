import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import Async from ".";

it("renders correctly", async () => {
  render(<Async />);

  expect(screen.getByText("Hello World")).toBeInTheDocument();
  // expect(
  //   await screen.findByText("Button", {}, { timeout: 1000 * 3 })
  // ).toBeInTheDocument();

  await waitForElementToBeRemoved(screen.queryByText("Button"), {
    timeout: 1000 * 3,
  });

  await waitFor(
    () => {
      return expect(screen.queryByText("Button")).not.toBeInTheDocument();
    },
    {
      timeout: 1000 * 3,
      // interval: ...
    }
  );
});
