import { useState, useEffect, useRef } from "react";
import { Modal } from "antd";
import MathTypeEditor from "react-mathtype-editor";
import katex from "katex";
import "katex/dist/katex.min.css";

const content = '<h1>一、点击下面公式部分编辑</h1><p>设<span data-latex="(\\Omega,\\mathcal{F},P)" data-type="inline-math"></span>为概率空间，<span data-latex="B" data-type="inline-math"></span>为已知发生的事件且<span data-latex="P(B)&gt;0" data-type="inline-math"></span>。事件<span data-latex="A_i" data-type="inline-math"></span>在<span data-latex="B" data-type="inline-math"></span>发生条件下的条件概率定义为<span data-latex="P(A_i|B)=\\frac{P(A_iB)}{P(B)}" data-type="inline-math"></span>。利用乘法公式<span data-latex="P(A_iB)=P(A_i)P(B|A_i)" data-type="inline-math"></span>，可得<span data-latex="P(A_i|B)=\\frac{P(A_i)P(B|A_i)}{P(B)}" data-type="inline-math"></span>。</p><h3>1.2 全概率公式在分母中的角色</h3><p>若<span data-latex="A_1,A_2,\\dots,A_n" data-type="inline-math"></span>构成<span data-latex="\\Omega" data-type="inline-math"></span>的一个划分，则<span data-latex="P(B)=\\sum_{j=1}^{n}P(A_j)P(B|A_j)" data-type="inline-math"></span>。将此式代入上式，即得贝叶斯公式的标准形式：<br><span data-latex="P(A_i|B)=\\frac{P(A_i)P(B|A_i)}{\\sum_{j=1}^{n}P(A_j)P(B|A_j)}" data-type="inline-math"></span>，其中<span data-latex="i=1,2,\\dots,n" data-type="inline-math"></span>。</p><h3>1.2 似然<span data-latex="P(B|A_i)" data-type="inline-math"></span></h3><p>刻画在假设<span data-latex="A_i" data-type="inline-math"></span>成立的条件下，观察到证据<span data-latex="B" data-type="inline-math"></span>的“似然度”。似然越大，说明<span data-latex="A_i" data-type="inline-math"></span>对<span data-latex="B" data-type="inline-math"></span>的解释力越强。</p>';
export default function HomePage() {
  const [formula, setFormula] = useState("");
  const [editingLatex, setEditingLatex] = useState("");
  const [currentElement, setCurrentElement] = useState<HTMLElement | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      // Find all elements with data-latex attribute and render them
      const mathElements = (contentRef.current as HTMLElement).querySelectorAll('[data-latex]');

      mathElements.forEach((element: Element) => {
        const latex = element.getAttribute('data-latex');
        const type = element.getAttribute('data-type');

        if (latex) {
          // Clear the element and render the LaTeX
          (element as HTMLElement).innerHTML = '';

          try {
            // Determine if it's inline or block math
            const isInline = type === 'inline-math';

            // Render the LaTeX using katex
            katex.render(latex, element as HTMLElement, {
              displayMode: !isInline, // For inline math, displayMode should be false
              throwOnError: false
            });

            // Add click event to allow editing
            (element as HTMLElement).style.cursor = 'pointer';
            (element as HTMLElement).addEventListener('click', (event) => {
              event.stopPropagation(); // Prevent event bubbling
              setEditingLatex(latex);
              setCurrentElement(element as HTMLElement);
              setIsModalVisible(true);
            });
          } catch (error) {
            console.error('Error rendering math:', error);
            (element as HTMLElement).textContent = latex; // Fallback to plain text
          }
        }
      });
    }
  }, []);

  const handleSaveFormula = () => {
    if (currentElement && editingLatex) {
      // Update the data-latex attribute
      currentElement.setAttribute('data-latex', editingLatex);
      
      // Re-render the formula with the updated LaTeX
      try {
        const isInline = currentElement.getAttribute('data-type') === 'inline-math';
        katex.render(editingLatex, currentElement, {
          displayMode: !isInline,
          throwOnError: false
        });
      } catch (error) {
        console.error('Error re-rendering math:', error);
        currentElement.textContent = editingLatex;
      }
    }
    setIsModalVisible(false);
  };

  return (
    <div>
      <div
        ref={contentRef}
        style={{ width: 800, margin: '0 auto' }}
        dangerouslySetInnerHTML={{
          __html: content,
        }}
      />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
     
      <div style={{ width: 800,margin:'0 auto' }}>
         <p><h1>二、 直接输入公式</h1></p>
        <MathTypeEditor
          defaultValue={formula}
          onChange={(value) => setFormula(value)}
          style={{ width: "100%" }}
        />
      </div>

      <Modal
        title="编辑公式"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleSaveFormula}
        width={800}
      >
        <div style={{ height: 400 }}>
          <MathTypeEditor
            defaultValue={editingLatex}
            onChange={(value) => setEditingLatex(value)}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      </Modal>
    </div>
  );
}
