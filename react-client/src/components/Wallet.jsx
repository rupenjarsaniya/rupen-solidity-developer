import { ConnectButton } from "@rainbow-me/rainbowkit";

const Wallet = () => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");

        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    type="button"
                    className="text-ttGreen text-12-500 flex px-[20px] py-[8px] bg-white items-center rounded-[50px] leading-[140%] w-full justify-center"
                  >
                    Connect Wallet
                  </button>
                );
              }

              if (chain.unsupported) {
                return (
                  <button
                    onClick={openChainModal}
                    type="button"
                    className="text-ttGreen text-12-500 flex px-[20px] py-[8px] bg-white items-center rounded-[50px] leading-[140%] w-full justify-center"
                  >
                    Wrong Network
                  </button>
                );
              }

              return (
                <div className="text-ttGreen text-12-500 flex px-[20px] py-[8px] bg-white items-center rounded-[50px] leading-[140%] w-full justify-center gap-2">
                  <button onClick={openAccountModal} type="button">
                    Hi, {account.displayName}
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};

export default Wallet;
