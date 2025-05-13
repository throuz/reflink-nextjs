/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/reflink.json`.
 */
export type Reflink = {
  address: "2BkHiWJxLd91RWQWWcr97ggCsdA3PY1MTRoC9AJuZad9";
  metadata: {
    name: "reflink";
    version: "0.1.0";
    spec: "0.1.0";
    description: "Created with Anchor";
  };
  instructions: [
    {
      name: "createAffiliateProgram";
      discriminator: [98, 186, 216, 40, 40, 253, 210, 236];
      accounts: [
        {
          name: "affiliateProgram";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  97,
                  102,
                  102,
                  105,
                  108,
                  105,
                  97,
                  116,
                  101,
                  95,
                  112,
                  114,
                  111,
                  103,
                  114,
                  97,
                  109
                ];
              },
              {
                kind: "account";
                path: "merchant";
              }
            ];
          };
        },
        {
          name: "merchant";
        },
        {
          name: "authority";
          writable: true;
          signer: true;
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        }
      ];
      args: [
        {
          name: "programName";
          type: "string";
        },
        {
          name: "referrerFeeBasisPoints";
          type: "u16";
        }
      ];
    },
    {
      name: "createMerchant";
      discriminator: [249, 172, 245, 100, 32, 117, 97, 156];
      accounts: [
        {
          name: "merchant";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [109, 101, 114, 99, 104, 97, 110, 116];
              },
              {
                kind: "account";
                path: "authority";
              }
            ];
          };
        },
        {
          name: "authority";
          writable: true;
          signer: true;
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        }
      ];
      args: [
        {
          name: "merchantName";
          type: "string";
        }
      ];
    },
    {
      name: "createReferralLink";
      discriminator: [246, 55, 144, 190, 86, 38, 25, 213];
      accounts: [
        {
          name: "referralLink";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  114,
                  101,
                  102,
                  101,
                  114,
                  114,
                  97,
                  108,
                  95,
                  108,
                  105,
                  110,
                  107
                ];
              },
              {
                kind: "account";
                path: "affiliateProgram";
              },
              {
                kind: "account";
                path: "referrer";
              }
            ];
          };
        },
        {
          name: "affiliateProgram";
        },
        {
          name: "referrer";
          writable: true;
          signer: true;
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        }
      ];
      args: [
        {
          name: "uniqueCode";
          type: "string";
        }
      ];
    },
    {
      name: "incrementClick";
      discriminator: [189, 6, 253, 63, 135, 146, 88, 65];
      accounts: [
        {
          name: "referralLink";
          writable: true;
        },
        {
          name: "authority";
          signer: true;
        }
      ];
      args: [];
    },
    {
      name: "initializePlatform";
      discriminator: [119, 201, 101, 45, 75, 122, 89, 3];
      accounts: [
        {
          name: "platform";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [112, 108, 97, 116, 102, 111, 114, 109];
              }
            ];
          };
        },
        {
          name: "authority";
          writable: true;
          signer: true;
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        }
      ];
      args: [
        {
          name: "platformFeeBasisPoints";
          type: "u16";
        }
      ];
    },
    {
      name: "processSale";
      discriminator: [103, 228, 248, 104, 78, 46, 193, 82];
      accounts: [
        {
          name: "platform";
        },
        {
          name: "merchant";
        },
        {
          name: "affiliateProgram";
        },
        {
          name: "referralLink";
          writable: true;
        },
        {
          name: "buyer";
          writable: true;
          signer: true;
        },
        {
          name: "buyerTokenAccount";
          writable: true;
        },
        {
          name: "merchantTokenAccount";
          writable: true;
        },
        {
          name: "referrerTokenAccount";
          writable: true;
        },
        {
          name: "platformTokenAccount";
          writable: true;
        },
        {
          name: "tokenProgram";
          address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
        }
      ];
      args: [
        {
          name: "amount";
          type: "u64";
        }
      ];
    },
    {
      name: "toggleAffiliateProgramStatus";
      discriminator: [11, 194, 31, 217, 193, 188, 43, 239];
      accounts: [
        {
          name: "affiliateProgram";
          writable: true;
        },
        {
          name: "merchant";
        },
        {
          name: "authority";
          signer: true;
        }
      ];
      args: [];
    },
    {
      name: "toggleMerchantStatus";
      discriminator: [251, 186, 166, 45, 108, 107, 186, 170];
      accounts: [
        {
          name: "merchant";
          writable: true;
        },
        {
          name: "authority";
          signer: true;
        }
      ];
      args: [];
    },
    {
      name: "toggleReferralLinkStatus";
      discriminator: [26, 73, 35, 181, 45, 41, 160, 31];
      accounts: [
        {
          name: "referralLink";
          writable: true;
        },
        {
          name: "authority";
          signer: true;
        }
      ];
      args: [];
    },
    {
      name: "updatePlatformFee";
      discriminator: [162, 97, 186, 47, 93, 113, 176, 243];
      accounts: [
        {
          name: "platform";
          writable: true;
        },
        {
          name: "authority";
          signer: true;
        }
      ];
      args: [
        {
          name: "newFeeBasisPoints";
          type: "u16";
        }
      ];
    }
  ];
  accounts: [
    {
      name: "affiliateProgram";
      discriminator: [101, 106, 6, 88, 121, 237, 223, 54];
    },
    {
      name: "merchant";
      discriminator: [71, 235, 30, 40, 231, 21, 32, 64];
    },
    {
      name: "platform";
      discriminator: [77, 92, 204, 58, 187, 98, 91, 12];
    },
    {
      name: "referralLink";
      discriminator: [30, 231, 159, 98, 189, 47, 48, 5];
    }
  ];
  errors: [
    {
      code: 6000;
      name: "invalidFeeBasisPoints";
      msg: "Fee basis points must be <= 10000";
    },
    {
      code: 6001;
      name: "nameTooLong";
      msg: "Name too long";
    },
    {
      code: 6002;
      name: "refCodeTooLong";
      msg: "Referral code too long";
    },
    {
      code: 6003;
      name: "invalidAmount";
      msg: "Invalid amount";
    },
    {
      code: 6004;
      name: "notPlatformAuthority";
      msg: "Not platform authority";
    },
    {
      code: 6005;
      name: "notMerchantAuthority";
      msg: "Not merchant authority";
    },
    {
      code: 6006;
      name: "notReferrer";
      msg: "Not referrer";
    },
    {
      code: 6007;
      name: "invalidAffiliateProgramMerchant";
      msg: "Invalid affiliate program merchant";
    },
    {
      code: 6008;
      name: "invalidReferralLinkAffiliateProgram";
      msg: "Invalid referral link affiliate program";
    },
    {
      code: 6009;
      name: "invalidOwner";
      msg: "Invalid token account owner";
    },
    {
      code: 6010;
      name: "inactiveMerchant";
      msg: "Merchant is inactive";
    },
    {
      code: 6011;
      name: "inactiveAffiliateProgram";
      msg: "Affiliate program is inactive";
    },
    {
      code: 6012;
      name: "inactiveReferralLink";
      msg: "Referral link is inactive";
    }
  ];
  types: [
    {
      name: "affiliateProgram";
      type: {
        kind: "struct";
        fields: [
          {
            name: "merchant";
            type: "pubkey";
          },
          {
            name: "name";
            type: "string";
          },
          {
            name: "referrerFeeBasisPoints";
            type: "u16";
          },
          {
            name: "isActive";
            type: "bool";
          },
          {
            name: "bump";
            type: "u8";
          }
        ];
      };
    },
    {
      name: "merchant";
      type: {
        kind: "struct";
        fields: [
          {
            name: "authority";
            type: "pubkey";
          },
          {
            name: "name";
            type: "string";
          },
          {
            name: "isActive";
            type: "bool";
          },
          {
            name: "bump";
            type: "u8";
          }
        ];
      };
    },
    {
      name: "platform";
      type: {
        kind: "struct";
        fields: [
          {
            name: "authority";
            type: "pubkey";
          },
          {
            name: "feeBasisPoints";
            type: "u16";
          },
          {
            name: "bump";
            type: "u8";
          }
        ];
      };
    },
    {
      name: "referralLink";
      type: {
        kind: "struct";
        fields: [
          {
            name: "affiliateProgram";
            type: "pubkey";
          },
          {
            name: "referrer";
            type: "pubkey";
          },
          {
            name: "code";
            type: "string";
          },
          {
            name: "clickCount";
            type: "u64";
          },
          {
            name: "conversionCount";
            type: "u64";
          },
          {
            name: "totalSales";
            type: "u64";
          },
          {
            name: "totalCommission";
            type: "u64";
          },
          {
            name: "isActive";
            type: "bool";
          },
          {
            name: "bump";
            type: "u8";
          }
        ];
      };
    }
  ];
};
