import { useNode, useEditor } from "@craftjs/core";
import { ROOT_NODE } from "@craftjs/utils";
import * as React from "react";
import ReactDOM from "react-dom";
import { BsArrowUp } from "react-icons/bs";
import { IoMove } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { styled } from "styled-components";

const IndicatorDiv = styled.div`
  height: 30px;
  margin-top: -29px;
  font-size: 12px;
  line-height: 12px;

  svg {
    width: 15px;
    height: 15px;
  }
`;

const Btn = styled.a`
  padding: 0 0px;
  opacity: 0.9;
  display: flex;
  align-items: center;
  > div {
    position: relative;
    top: -50%;
    left: -50%;
  }
`;

export const RenderNode = ({ render }: { render: React.ReactElement }) => {
  const { id } = useNode();
  const { actions, query, isActive } = useEditor((_, query) => ({
    isActive: query.getEvent("selected").contains(id),
  }));

  const {
    isHover,
    dom,
    name,
    moveable,
    deletable,
    connectors: { drag },
    parent,
  } = useNode((node) => ({
    isHover: node.events.hovered,
    dom: node.dom,
    name: node.data.custom.displayName || node.data.displayName,
    moveable: query.node(node.id).isDraggable(),
    deletable: query.node(node.id).isDeletable(),
    parent: node.data.parent,
    props: node.data.props,
  }));

  const currentRef = React.useRef<HTMLDivElement | null>(null);
  const container = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (dom) {
      if (isActive || isHover) dom.classList.add("component-selected");
      else dom.classList.remove("component-selected");
    }
  }, [dom, isActive, isHover]);

  const getPos = React.useCallback((dom: HTMLElement) => {
    const { top: containerTop } =
      container.current?.getBoundingClientRect() || { top: 0 };
    const { top, left, bottom } = dom
      ? dom.getBoundingClientRect()
      : { top: 0, left: 0, bottom: 0 };
    return {
      top: `${top > containerTop ? top : bottom}px`,
      left: `${left}px`,
    };
  }, []);

  const scroll = React.useCallback(() => {
    const { current: currentDOM } = currentRef;

    if (!currentDOM || !dom) {
      return;
    }

    const { top, left } = getPos(dom);
    currentDOM.style.top = top;
    currentDOM.style.left = left;
  }, [dom, getPos]);

  React.useEffect(() => {
    container.current = document.querySelector(".page-container");
  }, []);

  React.useEffect(() => {
    if (!container.current) {
      return;
    }
    container.current.addEventListener("scroll", scroll);

    return () => {
      container.current?.removeEventListener("scroll", scroll);
    };
  }, [scroll]);

  return (
    <>
      {dom && container.current && (isHover || isActive)
        ? ReactDOM.createPortal(
            <IndicatorDiv
              ref={currentRef}
              className="px-2 py-2 text-white bg-accent fixed flex items-center"
              style={{
                left: getPos(dom).left,
                top: getPos(dom).top,
                zIndex: 9999,
              }}
            >
              <h2 className="flex-1 mr-4">{name}</h2>
              {moveable ? (
                <Btn
                  className="mr-2 cursor-move"
                  ref={(dom) => {
                    if (dom) {
                      drag(dom);
                    }
                  }}
                >
                  <IoMove />
                </Btn>
              ) : null}
              {id !== ROOT_NODE && (
                <Btn
                  className="mr-2 cursor-pointer"
                  onClick={() => {
                    if (parent) {
                      actions.selectNode(parent);
                    }
                  }}
                >
                  <BsArrowUp />
                </Btn>
              )}
              {deletable ? (
                <Btn
                  className="cursor-pointer"
                  onMouseDown={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    actions.delete(id);
                  }}
                >
                  <MdDelete />
                </Btn>
              ) : null}
            </IndicatorDiv>,
            container.current,
          )
        : null}
      {render}
    </>
  );
};
