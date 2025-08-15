import React, { useEffect, useState, useRef } from "react";
import { JsonRpcProvider } from "ethers";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as Dialog from "@radix-ui/react-dialog";
import * as THREE from "three";

interface Block {
  number: number;
  hash: string;
  miner: string;
  timestamp: number;
  transactions: string[];
}

const BlockCube: React.FC<{
  block: Block;
  position: [number, number, number];
}> = ({ block, position }) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <mesh position={position} onClick={() => setOpen(true)}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#00FF00" /> {/* Bright green */}
        <Html distanceFactor={10}>
          <div style={{ fontSize: "0.5rem", color: "white" }}>
            #{block.number}
          </div>
        </Html>
      </mesh>

      <Dialog.Portal>
        <Dialog.Overlay
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
            position: "fixed",
            inset: 0,
          }}
        />
        <Dialog.Content
          style={{
            background: "white",
            borderRadius: "8px",
            padding: "1rem",
            maxWidth: "400px",
            margin: "10% auto",
          }}
        >
          <Dialog.Title>Block #{block.number}</Dialog.Title>
          <p>
            <strong>Miner:</strong> {block.miner}
          </p>
          <p>
            <strong>Tx Count:</strong> {block.transactions.length}
          </p>
          <p>
            <strong>Time:</strong>{" "}
            {new Date(block.timestamp * 1000).toLocaleString()}
          </p>
          <p style={{ fontSize: "0.75rem", wordBreak: "break-all" }}>
            <strong>Hash:</strong> {block.hash}
          </p>
          <Dialog.Close
            style={{
              marginTop: "1rem",
              background: "#333",
              color: "white",
              padding: "0.5rem 1rem",
              borderRadius: "4px",
            }}
          >
            Close
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

const FixedOrbitControls = () => {
  const { camera, gl } = useThree();
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    if (controlsRef.current) {
      // Lock vertical rotation
      controlsRef.current.minPolarAngle = Math.PI / 2;
      controlsRef.current.maxPolarAngle = Math.PI / 2;

      // Disable zoom if you want fixed distance, else keep it enabled
      controlsRef.current.enableZoom = false;

      // Restrict panning to X-axis only
      controlsRef.current.addEventListener("change", () => {
        camera.position.y = 1; // fixed height
        camera.position.z = 10; // fixed distance
      });
    }
  }, [camera]);

  return (
    <OrbitControls
      ref={controlsRef}
      args={[camera, gl.domElement]}
      enablePan
      enableRotate={false}
    />
  );
};

const BlockchainVisualizer: React.FC = () => {
  const [blocks, setBlocks] = useState<Block[]>([]);

  useEffect(() => {
    const fetchBlocks = async () => {
      try {
        const provider = new JsonRpcProvider("http://localhost:8545");
        const latest = await provider.getBlockNumber();
        console.log("🔢 Latest Block Number:", latest);

        const temp: Block[] = [];
        for (let i = latest; i >= Math.max(0, latest - 15); i--) {
          const block = await provider.getBlock(i);
          if (block) {
            console.log(`📦 Block ${block.number} fetched`);
            temp.push({
              number: block.number,
              hash: block.hash,
              miner: block.miner,
              timestamp: block.timestamp,
              transactions: [...block.transactions],
            });
          } else {
            console.warn(`⚠️ Block ${i} not found`);
          }
        }
        setBlocks(temp.reverse());
      } catch (err) {
        console.error("❌ Error fetching blocks:", err);
      }
    };

    fetchBlocks();
  }, []);

  return (
    <div style={{ height: "300px", width: "100%", background: "black" }}>
      {blocks.length === 0 ? (
        <p style={{ padding: "1rem", color: "white" }}>⏳ Loading blocks...</p>
      ) : (
        <Canvas camera={{ position: [0, 3, 10], fov: 50 }}>
          <color attach="background" args={["black"]} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <FixedOrbitControls />
          {blocks.map((block, idx) => (
            <BlockCube
              key={block.hash}
              block={block}
              position={[idx * 2, 0, 0]} // horizontal spacing
            />
          ))}
        </Canvas>
      )}
    </div>
  );
};

export default BlockchainVisualizer;
