"use client";

import { Layers } from "@craftjs/layers";
import { Button, Surface } from "@heroui/react";
import { motion } from "motion/react";
import { useState } from "react";
import { FaChevronUp } from "react-icons/fa6";

export const LayersPanel = () => {
  const [expanded, setExpanded] = useState(false);
  return (
    <Surface>
      <p className="text-lg font-bold">Layers</p>
      <Layers />
    </Surface>
  );
};
