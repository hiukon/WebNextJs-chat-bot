"use client";

import { useRouter } from "next/navigation";
import styles from "./shop.module.css";

export default function Shopping() {
    const router = useRouter();

    return (
        <button
            id="chatbot-toggler"
            className={styles.toggler}
            aria-label="Toggle chatbot"
            onClick={() => router.push("/bill")}
        >
            <span className="material-symbols-rounded">add_shopping_cart</span>
            <span className="material-symbols-rounded">close</span>
        </button>
    );
}
