import { render, screen, fireEvent } from "@testing-library/react";
import { mocked } from "jest-mock";
import { SubscribeButton } from ".";
import { useRouter } from "next/router";
import { SessionContextValue, signIn, useSession } from "next-auth/react";

jest.mock("next-auth/react");
// , () => ({
// useSession: () => ({ data: null, status: "unauthenticated" }),
// signIn: jest.fn(),
// }));

jest.mock("next/router");
// , () => ({ useRouter: () => ({ push: jest.fn() }) })

describe("SubscribeButton component", () => {
  it("renders correctly", () => {
    const useSessionMocked = mocked(useSession);

    useSessionMocked.mockReturnValueOnce({
      data: null,
      status: "unauthenticated",
    });

    const { debug } = render(<SubscribeButton />);

    expect(screen.getByText(/Subscribe now/i)).toBeInTheDocument();

    // debug();
  });

  it("redirects user to sign in when not authenticated", () => {
    const signInMocked = mocked(signIn);
    const useSessionMocked = mocked(useSession);

    useSessionMocked.mockReturnValueOnce({
      data: null,
      status: "unauthenticated",
    });

    render(<SubscribeButton />);

    const subscribeButton = screen.getByText("Subscribe Now");

    fireEvent.click(subscribeButton);

    expect(signInMocked).toHaveBeenCalled();
  });

  it("redirects to posts when user is already a subscriber", () => {
    const useRouterMocked = mocked(useRouter);
    const useSessionMocked = mocked(useSession);
    const pushMock = jest.fn();

    useSessionMocked.mockReturnValueOnce({
      data: {
        user: { name: "John Doe", email: "johndoe@email.com" },
        expires: "never",
        activeSubscription: "fake-active-subscription",
      },
      status: "authenticated",
    } as SessionContextValue);

    useRouterMocked.mockReturnValueOnce({ push: pushMock } as never);

    render(<SubscribeButton />);

    const subscribeButton = screen.getByText("Subscribe Now");

    fireEvent.click(subscribeButton);

    // expect(pushMock).toHaveBeenCalled();
    expect(pushMock).toHaveBeenCalledWith("/posts");
  });
});
