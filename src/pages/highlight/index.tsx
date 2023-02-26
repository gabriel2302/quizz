import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { FiAward } from 'react-icons/fi';
import styles from './highlight.module.scss'

type Highlight = {
  anshwered: string;
  quiz_id: number;
  title: string;
  url: string;
  alternative_text: string;
  percentage: number;
}

export default function Highlight() {
  const [highlight, setHighlight] = useState<Highlight[]>([])
  const { push } = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const highlightList = await getHighlight();
      setHighlight(highlightList);
      console.log(highlightList)
    }
    fetchData()

  }, []);

  const choiceMeanColor = (percentage: number) => {
    if (percentage >= 70) {
      return 'green'
    }
    if (percentage >= 50) {
      return 'yellow'
    }
    return 'red'
  }
  return (
    <div className={styles.highlightBox}>
      <h1 className={styles.title}>Quiz em alta (Top 10)</h1>

      {highlight.map((item, index) => (
        <div key={item.quiz_id} className={styles.highlightItem}>
          <div className={styles.titleBox}>
            <h2 className={styles.highlightItemTitle}>
              {item.title}
            </h2>
            {index < 3 && (
              <div className={styles.badge}>
              <FiAward size={24} className={styles.badgeIcon}/>
              <span className={styles.badgeCount}>{index + 1}</span>
            </div>
            )}
            
          </div>
          <div className={styles.highlightItemDescription}>
            <span>Respondido <span className={styles.amount}>{item.anshwered}</span> {Number(item.anshwered) > 1 ? 'vezes' : 'vez'}</span>
            <span className={`${styles.mean}`}> - Média de acertos: 
              <span className={`${styles[choiceMeanColor(item.percentage)]}`}> {item.percentage}%</span>
            </span>
          </div>
          <div style={{ position: 'relative' }}>
            <Image
              className={styles.image}
              fill
              priority
              style={{ objectFit: 'cover' }}
              alt={item.alternative_text}
              src={item.url}
              sizes="(min-width: 60em) 24vw,
                    (min-width: 28em) 45vw,
                    100vw"
            />
          </div>

          <button type='button' className={styles.button} role="link" onClick={() => push(`/quiz/${item.quiz_id}`)}>Fazer quiz</button>
        </div>
      ))}
    </div>
  )
}

const getHighlight = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/interactions/count`, { next: { revalidate: 60 * 60 } })
  const highlight = await response.json()
  return highlight;
}