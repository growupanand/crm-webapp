import * as React from "react";
import * as PropTypes from "prop-types";

const globals = {
  React,
  PropTypes,
} as Record<string, any>;

Object.keys(globals).forEach(
  (name) => ((window as Record<string, any>)[name] = globals[name])
);

export default globals;
