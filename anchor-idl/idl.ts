/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/reflink.json`.
 */
export type Reflink = {
  address: "8fbRBf8a2mfYz4UAGZnsdbuCCB6LsXKePkZrv4MefRCX";
  metadata: {
    name: "reflink";
    version: "0.1.0";
    spec: "0.1.0";
    description: "Created with Anchor";
  };
  instructions: [
    {
      name: "joinMerchant";
      discriminator: [222, 215, 177, 87, 139, 47, 221, 130];
      accounts: [
        {
          name: "authority";
          writable: true;
          signer: true;
        },
        {
          name: "affiliate";
          pda: {
            seeds: [
              {
                kind: "const";
                value: [97, 102, 102, 105, 108, 105, 97, 116, 101];
              },
              {
                kind: "account";
                path: "authority";
              }
            ];
          };
        },
        {
          name: "merchant";
          pda: {
            seeds: [
              {
                kind: "const";
                value: [109, 101, 114, 99, 104, 97, 110, 116];
              },
              {
                kind: "account";
                path: "merchant.authority";
                account: "merchant";
              }
            ];
          };
        },
        {
          name: "affiliateMerchant";
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
                  45,
                  109,
                  101,
                  114,
                  99,
                  104,
                  97,
                  110,
                  116
                ];
              },
              {
                kind: "account";
                path: "affiliate";
              },
              {
                kind: "account";
                path: "merchant";
              }
            ];
          };
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        }
      ];
      args: [];
    },
    {
      name: "processPurchase";
      discriminator: [38, 233, 48, 62, 162, 120, 177, 244];
      accounts: [
        {
          name: "customer";
          writable: true;
          signer: true;
        },
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
                path: "merchant.authority";
                account: "merchant";
              }
            ];
          };
        },
        {
          name: "affiliate";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [97, 102, 102, 105, 108, 105, 97, 116, 101];
              },
              {
                kind: "account";
                path: "affiliate.authority";
                account: "affiliate";
              }
            ];
          };
        },
        {
          name: "affiliateMerchant";
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
                  45,
                  109,
                  101,
                  114,
                  99,
                  104,
                  97,
                  110,
                  116
                ];
              },
              {
                kind: "account";
                path: "affiliate";
              },
              {
                kind: "account";
                path: "merchant";
              }
            ];
          };
        },
        {
          name: "merchantAuthority";
          writable: true;
        },
        {
          name: "affiliateAuthority";
          writable: true;
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
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
      name: "registerAffiliate";
      discriminator: [87, 121, 99, 184, 126, 63, 103, 217];
      accounts: [
        {
          name: "authority";
          writable: true;
          signer: true;
        },
        {
          name: "affiliate";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [97, 102, 102, 105, 108, 105, 97, 116, 101];
              },
              {
                kind: "account";
                path: "authority";
              }
            ];
          };
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        }
      ];
      args: [
        {
          name: "name";
          type: "string";
        }
      ];
    },
    {
      name: "registerMerchant";
      discriminator: [238, 245, 77, 132, 161, 88, 216, 248];
      accounts: [
        {
          name: "authority";
          writable: true;
          signer: true;
        },
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
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        }
      ];
      args: [
        {
          name: "name";
          type: "string";
        },
        {
          name: "commissionRate";
          type: "u8";
        },
        {
          name: "websiteUrl";
          type: "string";
        }
      ];
    },
    {
      name: "updateAffiliate";
      discriminator: [4, 8, 247, 126, 7, 112, 181, 99];
      accounts: [
        {
          name: "authority";
          writable: true;
          signer: true;
        },
        {
          name: "affiliate";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [97, 102, 102, 105, 108, 105, 97, 116, 101];
              },
              {
                kind: "account";
                path: "authority";
              }
            ];
          };
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        }
      ];
      args: [
        {
          name: "name";
          type: {
            option: "string";
          };
        }
      ];
    },
    {
      name: "updateMerchant";
      discriminator: [192, 114, 143, 220, 199, 50, 234, 165];
      accounts: [
        {
          name: "authority";
          writable: true;
          signer: true;
        },
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
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        }
      ];
      args: [
        {
          name: "name";
          type: {
            option: "string";
          };
        },
        {
          name: "commissionRate";
          type: {
            option: "u8";
          };
        },
        {
          name: "websiteUrl";
          type: {
            option: "string";
          };
        },
        {
          name: "isActive";
          type: {
            option: "bool";
          };
        }
      ];
    }
  ];
  accounts: [
    {
      name: "affiliate";
      discriminator: [136, 95, 107, 149, 36, 195, 146, 35];
    },
    {
      name: "affiliateMerchant";
      discriminator: [188, 88, 40, 90, 229, 87, 157, 141];
    },
    {
      name: "merchant";
      discriminator: [71, 235, 30, 40, 231, 21, 32, 64];
    }
  ];
  errors: [
    {
      code: 6000;
      name: "unauthorized";
      msg: "You are not authorized to perform this action";
    },
    {
      code: 6001;
      name: "invalidCommissionRate";
      msg: "Commission rate must be between 0 and 100";
    },
    {
      code: 6002;
      name: "merchantInactive";
      msg: "Merchant is not active";
    }
  ];
  types: [
    {
      name: "affiliate";
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
            name: "totalCommission";
            type: "u64";
          },
          {
            name: "totalReferrals";
            type: "u64";
          },
          {
            name: "bump";
            type: "u8";
          }
        ];
      };
    },
    {
      name: "affiliateMerchant";
      type: {
        kind: "struct";
        fields: [
          {
            name: "merchant";
            type: "pubkey";
          },
          {
            name: "affiliate";
            type: "pubkey";
          },
          {
            name: "commissionEarned";
            type: "u64";
          },
          {
            name: "successfulReferrals";
            type: "u64";
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
            name: "commissionRate";
            type: "u8";
          },
          {
            name: "websiteUrl";
            type: "string";
          },
          {
            name: "totalRevenue";
            type: "u64";
          },
          {
            name: "totalReferrals";
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
