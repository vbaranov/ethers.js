"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockscoutProvider = void 0;
/**
 *  [[link-blockscout]] provides a third-party service for connecting to
 *  various blockchains over JSON-RPC.
 *
 *  **Supported Networks**
 *
 *  - Ethereum Mainnet (``mainnet``)
 *  - Sepolia Testnet (``eth-sepolia``)
 *  - Holesky Testnet (``eth-holesky``)
 *  - Arbitrum One (``arbitrum``)
 *  - Arbitrum Nova (``arbitrum-nova``)
 *  - Arbitrum Sepolia (``arbitrum-sepolia``)
 *  - Base Mainnet (``base``)
 *  - Base Sepolia Testnet (``base-sepolia``)
 *  - Gnosis Chain (``gnosis``)
 *  - Gnosis Chiado Testnet (``gnosis-chiado``)
 *  - Optimism Mainnet (``optimism``)
 *  - Optimism Sepolia Testnet (``optimism-sepolia``)
 *  - Polygon (``matic``)
 *  - Polygon zkEVM (``matic-zkevm``)
 *  - zkSync Era Mainnet (``zksync``)
 *  - zkSync Sepolia Testnet (``zksync-sepolia``)
 *
 *  @_subsection: api/providers/thirdparty:Blockscout  [providers-blockscout]
 */
const index_js_1 = require("../utils/index.js");
const community_js_1 = require("./community.js");
const network_js_1 = require("./network.js");
const provider_jsonrpc_js_1 = require("./provider-jsonrpc.js");
const defaultApiKey = "";
function getHost(name) {
    const baseDomain = "blockscout.com";
    const apiPath = "/api/eth-rpc";
    switch (name) {
        case "mainnet":
            return `eth.${baseDomain}${apiPath}`;
        case "sepolia":
            return `eth-sepolia.${baseDomain}${apiPath}`;
        case "eth-holesky":
            return `eth-holesky.${baseDomain}${apiPath}`;
        case "gnosis":
            return `gnosis.${baseDomain}${apiPath}`;
        case "gnosis-chiado":
            return `gnosis-chiado.${baseDomain}${apiPath}`;
        case "arbitrum":
            return `arbitrum.${baseDomain}${apiPath}`;
        case "arbitrum-nova":
            return `arbitrum-nova.${baseDomain}${apiPath}`;
        case "arbitrum-sepolia":
            return `arbitrum-sepolia.${baseDomain}${apiPath}`;
        case "base":
            return `base.${baseDomain}${apiPath}`;
        case "base-sepolia":
            return `base-sepolia.${baseDomain}${apiPath}`;
        case "matic":
            return `polygon.${baseDomain}${apiPath}`;
        case "matic-zkevm":
            return `zkevm.${baseDomain}${apiPath}`;
        case "optimism":
            return `optimism.${baseDomain}${apiPath}`;
        case "optimism-sepolia":
            return `optimism-sepolia.${baseDomain}${apiPath}`;
        case "zksync":
            return `zksync.${baseDomain}${apiPath}`;
        case "zksync-sepolia":
            return `zksync-sepolia.${baseDomain}${apiPath}`;
        default:
    }
    (0, index_js_1.assertArgument)(false, "unsupported network", "network", name);
}
/**
 *  The **BlockscoutProvider** connects to the [[link-blockscout]]
 *  JSON-RPC end-points.
 *
 *  By default, a highly-throttled API key is used, which is
 *  appropriate for quick prototypes and simple scripts. To
 *  gain access to an increased rate-limit, it is highly
 *  recommended to [sign up here](link-blockscout-signup).
 */
class BlockscoutProvider extends provider_jsonrpc_js_1.JsonRpcProvider {
    /**
     *  The API key for the Blockscout connection.
     */
    apiKey;
    /**
     *  Create a new **BlockscoutProvider**.
     *
     *  By default connecting to ``mainnet`` with a highly throttled
     *  API key.
     */
    constructor(_network, apiKey) {
        if (_network == null) {
            _network = "mainnet";
        }
        const network = network_js_1.Network.from(_network);
        if (apiKey == null) {
            apiKey = defaultApiKey;
        }
        // Blockscout does not support filterId, so we force polling
        const options = { polling: true, staticNetwork: network };
        const request = BlockscoutProvider.getRequest(network, apiKey);
        super(request, network, options);
        (0, index_js_1.defineProperties)(this, { apiKey });
    }
    _getProvider(chainId) {
        try {
            return new BlockscoutProvider(chainId, this.apiKey);
        }
        catch (error) { }
        return super._getProvider(chainId);
    }
    /**
     *  Returns a prepared request for connecting to %%network%% with
     *  %%apiKey%%.
     */
    static getRequest(network, apiKey) {
        if (apiKey == null) {
            apiKey = defaultApiKey;
        }
        const request = new index_js_1.FetchRequest(`https:/\/${getHost(network.name)}?apikey=${apiKey}`);
        request.allowGzip = true;
        if (apiKey === defaultApiKey) {
            request.retryFunc = async (request, response, attempt) => {
                (0, community_js_1.showThrottleMessage)("BlockscoutProvider");
                return true;
            };
        }
        return request;
    }
    getRpcError(payload, error) {
        if (payload.method === "eth_sendRawTransaction") {
            if (error && error.error && error.error.message === "INTERNAL_ERROR: could not replace existing tx") {
                error.error.message = "replacement transaction underpriced";
            }
        }
        return super.getRpcError(payload, error);
    }
    isCommunityResource() {
        return (this.apiKey === defaultApiKey);
    }
}
exports.BlockscoutProvider = BlockscoutProvider;
//# sourceMappingURL=provider-blockscout.js.map