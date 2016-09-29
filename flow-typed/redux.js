'use babel';

// @flow
/* eslint-disable no-unused-vars */

type redux$Action = {
  type: string;
}

type redux$Store = {
  getState(): any;
  subscribe(listener: Function): Function;
}
