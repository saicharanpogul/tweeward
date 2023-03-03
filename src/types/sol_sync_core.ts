export type SolSyncCore = {
  "version": "0.1.0",
  "name": "sol_sync_core",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "dapp",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "dataType",
          "type": {
            "array": [
              "u8",
              8
            ]
          }
        }
      ]
    },
    {
      "name": "updateDapp",
      "accounts": [
        {
          "name": "dapp",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "data",
          "type": "bytes"
        },
        {
          "name": "spans",
          "type": "bytes"
        }
      ]
    },
    {
      "name": "closeDapp",
      "accounts": [
        {
          "name": "dapp",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "dapp",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "dataType",
            "type": {
              "array": [
                "u8",
                8
              ]
            }
          },
          {
            "name": "data",
            "type": "bytes"
          },
          {
            "name": "spans",
            "type": "bytes"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "Ix",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Init"
          },
          {
            "name": "Update"
          },
          {
            "name": "Close"
          }
        ]
      }
    }
  ],
  "events": [
    {
      "name": "DappEvent",
      "fields": [
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "dataType",
          "type": {
            "array": [
              "u8",
              8
            ]
          },
          "index": false
        },
        {
          "name": "ix",
          "type": {
            "defined": "Ix"
          },
          "index": false
        }
      ]
    }
  ]
};

export const IDL: SolSyncCore = {
  "version": "0.1.0",
  "name": "sol_sync_core",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "dapp",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "dataType",
          "type": {
            "array": [
              "u8",
              8
            ]
          }
        }
      ]
    },
    {
      "name": "updateDapp",
      "accounts": [
        {
          "name": "dapp",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "data",
          "type": "bytes"
        },
        {
          "name": "spans",
          "type": "bytes"
        }
      ]
    },
    {
      "name": "closeDapp",
      "accounts": [
        {
          "name": "dapp",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "dapp",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "dataType",
            "type": {
              "array": [
                "u8",
                8
              ]
            }
          },
          {
            "name": "data",
            "type": "bytes"
          },
          {
            "name": "spans",
            "type": "bytes"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "Ix",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Init"
          },
          {
            "name": "Update"
          },
          {
            "name": "Close"
          }
        ]
      }
    }
  ],
  "events": [
    {
      "name": "DappEvent",
      "fields": [
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "dataType",
          "type": {
            "array": [
              "u8",
              8
            ]
          },
          "index": false
        },
        {
          "name": "ix",
          "type": {
            "defined": "Ix"
          },
          "index": false
        }
      ]
    }
  ]
};
