import { OnTransactionHandler } from '@metamask/snap-types';
import {
  add0x,
  bytesToHex,
  hasProperty,
  isObject,
  Json,
  remove0x,
  valueToBytes,
} from '@metamask/utils';
import { utils } from 'ethers';

const API_ENDPOINT = `https://www.4byte.directory/api/v1/signatures/?hex_signature=`;

async function getFunctionSignatureHumanReadableFrom4byte(
  functionSignature: string,
) {
  let response = await fetch(`${API_ENDPOINT}${functionSignature}`);
  let { results } = await response.json();
  const [matchingFunction] = results
    .sort((a, b) => a.created_at.localeCompare(b.created_at))
    .map((value) => value.text_signature);

  if (!matchingFunction) {
    console.log('No Matching Function found!');
    return;
  }

  return matchingFunction;
}

export const onTransaction: OnTransactionHandler = async ({
  transaction,
  chainId,
}) => {
  const insights: { type: string; params?: Json } = {
    type: 'Unknown Transaction Type',
  };

  if (
    !isObject(transaction) ||
    !hasProperty(transaction, 'data') ||
    typeof transaction.data !== 'string'
  ) {
    console.warn('Unknown Transaction Type');
    return { insights };
  }

  let { from, to, data, value } = transaction;
  let functionSignature = data.slice(0, 8);

  let matchingFunction = await getFunctionSignatureHumanReadableFrom4byte(
    functionSignature,
  );

  console.log(matchingFunction);

  let types = matchingFunction
    .slice(matchingFunction.indexOf('(') + 2, matchingFunction.indexOf(')'))
    .split(',');

  let functionParams = data.slice(8);

  try {
    let decoder = new utils.AbiCoder();
    let decodedParams = decoder.decode(types, add0x(functionParams));
    console.log(decodedParams);
  } catch (e) {
    return {
      insights: {
        Error: e,
      },
    };
  }

  // let toAddress = utils.getAddress(to as string);

  // // const txData = remove0x(data);
  // const chainIdInt = chainId.replace('eip155:', '');

  // let url = `https://repo.sourcify.dev/contracts/full_match/${chainIdInt}/${toAddress}/metadata.json`;

  // let response = await fetch(url, {
  //   method: 'get',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  // });

  // if (!response.ok) {
  //   return {
  //     insights: {
  //       error: 'No Data Found',
  //     },
  //   };
  // }

  // const { output } = await response.json();

  // console.log(output.userdoc);

  return {
    insights: {
      function: matchingFunction,
      // 'What does it do?': output.userdoc.methods[matchingFunction].notice,
    },
  };
};

function normalizeAbiValue(value: unknown): Json {
  if (Array.isArray(value)) {
    return value.map(normalizeAbiValue);
  }

  if (value instanceof Uint8Array) {
    return bytesToHex(value);
  }

  if (typeof value === 'bigint') {
    return value.toString();
  }

  return value as Json;
}
