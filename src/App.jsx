import { useRef, useState, useEffect } from 'react'
import couplePhoto from './assets/photo.jpg'
import heartSvg from './assets/heart.svg'
import sticker2 from './assets/sticker2.webp'
import sticker3 from './assets/sticker3.webp'
import sticker4 from './assets/sticker4.webp'
import sticker5 from './assets/sticker5.webp'
import sticker6 from './assets/sticker6.webp'
import sticker7 from './assets/sticker7.webp'
import glove from './assets/Glove.png'
import location from './assets/Location.jpg'
import photo2 from './assets/photo2.jpg'
import timing from './assets/background.jpg'
import sticker14 from './assets/sticker14.webp'
import heartsBg from './assets/Backgrounds_Hearts.jpg'

const RSVP_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbzf8eIl2MWF-8vcETEveiKXUTKGkwiRcy4MDEuPlbCe31gq4dXM__SA2D0J4hji7HiAXA/exec'

const attendanceLabels = {
  yes: 'Да, с удовольствием!',
  no: 'К сожалению, не смогу',
}

const alcoholLabels = {
  'white-wine': 'Белое вино',
  'red-wine': 'Красное вино',
  champagne: 'Шампанское',
  vodka: 'Водка',
  whiskey: 'Виски',
  'soft-drinks': 'Безалкогольные напитки',
}

const hotLabels = {
  meat: 'Мясо',
  fish: 'Рыба',
}

const alcoholOptions = Object.entries(alcoholLabels)
const hotOptions = Object.entries(hotLabels)

function createGuest(id = 1) {
  return {
    id,
    name: '',
    attendance: '',
    alcohol: [],
    hot: '',
  }
}

function getCountdownParts() {
  const now = new Date()
  const target = new Date(2026, 7, 8, 15, 0, 0)

  if (now >= target) {
    return { months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 }
  }

  let months =
    (target.getFullYear() - now.getFullYear()) * 12 +
    (target.getMonth() - now.getMonth())

  const anchor = new Date(now)
  anchor.setMonth(anchor.getMonth() + months)

  if (anchor > target) {
    months -= 1
    anchor.setMonth(anchor.getMonth() - 1)
  }

  const remainingMs = target - anchor
  const totalSeconds = Math.max(0, Math.floor(remainingMs / 1000))
  const days = Math.floor(totalSeconds / (60 * 60 * 24))
  const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60))
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60)
  const seconds = totalSeconds % 60

  return { months, days, hours, minutes, seconds }
}

function App() {
  const closingImageRef = useRef(null)
  const introDateRef = useRef(null)
  const closingWaitSectionRef = useRef(null)
  const nextGuestIdRef = useRef(2)
  const [introDateVisible, setIntroDateVisible] = useState(false)
  const [isClosingImageVisible, setIsClosingImageVisible] = useState(false)
  const [countdown, setCountdown] = useState(() => getCountdownParts())
  const [rsvpStatus, setRsvpStatus] = useState('idle')
  const [rsvpComment, setRsvpComment] = useState('')
  const [guests, setGuests] = useState(() => [createGuest(1)])
  const dressCodeStickers = [sticker2, sticker3, sticker4, sticker5, sticker6]

  useEffect(() => {
    const node = closingImageRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsClosingImageVisible(true)
          }
        })
      },
      { threshold: 0.2 }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const node = introDateRef.current
    if (!node) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setIntroDateVisible(true)
        })
      },
      { threshold: 0.2 }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const els = Array.from(
      document.querySelectorAll('.reveal-item[data-reveal-index]')
    )
    if (!els.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-item--visible')
          }
        })
      },
      {
        threshold: 0.05,
        // Включаемся, когда элемент поднимается в нижнюю треть экрана
        rootMargin: '67px 0px 0px 0px',
      }
    )

    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const updateCountdown = () => {
      setCountdown(getCountdownParts())
    }

    updateCountdown()
    const intervalId = window.setInterval(updateCountdown, 1000)
    return () => window.clearInterval(intervalId)
  }, [])

  const timelineEvents = [
    {
      time: '15:00',
      title: 'Welcome',
      desc: 'Время пролетит легко за игристым и душевным общением с дорогими сердцу людьми',
      side: 'left',
    },
    {
      time: '15:30',
      title: 'Церемония',
      desc: 'На всякий случай приготовьте платочки для трогательного момента',
      side: 'right',
    },
    {
      time: '16:00',
      title: 'Начало банкета',
      desc: 'Вкусные блюда, весёлая программа и искренние улыбки — всё, чтобы этот день стал незабываемым',
      side: 'left',
    },
    {
      time: '22:00',
      title: 'Завершение банкета',
      desc: 'К сожалению, даже такой прекрасный вечер может закончиться',
      side: 'right',
    },
  ]

  const updateGuest = (guestId, updater) => {
    setGuests((prev) =>
      prev.map((guest) => (guest.id === guestId ? { ...guest, ...updater(guest) } : guest))
    )
  }

  const addGuest = () => {
    setGuests((prev) => [...prev, createGuest(nextGuestIdRef.current)])
    nextGuestIdRef.current += 1
  }

  const removeGuest = (guestId) => {
    setGuests((prev) => prev.filter((guest) => guest.id !== guestId))
  }

  const formatGuestSummary = (guest, dictionary, field) => {
    if (field === 'alcohol') {
      if (!guest.alcohol.length) return '—'
      return guest.alcohol.map((item) => dictionary[item] || item).join(', ')
    }

    if (!guest[field]) return '—'
    return dictionary[guest[field]] || guest[field]
  }

  const handleRsvpSubmit = async (event) => {
    event.preventDefault()
    const form = event.currentTarget
    const normalizedGuests = guests.map((guest) => ({
      ...guest,
      name: guest.name.trim(),
    }))

    if (
      normalizedGuests.some((guest) => !guest.name) ||
      normalizedGuests.some((guest) => !guest.attendance)
    ) {
      setRsvpStatus('validation_error')
      return
    }

    const preparedGuests = normalizedGuests.map((guest) => ({
      name: guest.name,
      attendance: attendanceLabels[guest.attendance] || guest.attendance,
      alcohol: formatGuestSummary(guest, alcoholLabels, 'alcohol'),
      hot:
        guest.attendance === 'no'
          ? '—'
          : hotLabels[guest.hot] || guest.hot || '—',
    }))

    const legacyAttendance = normalizedGuests.every((guest) => guest.attendance === 'no')
      ? 'no'
      : 'yes'
    const legacyAlcohol = [
      ...new Set(normalizedGuests.flatMap((guest) => guest.alcohol)),
    ].join(',')
    const legacyHot = [
      ...new Set(normalizedGuests.map((guest) => guest.hot).filter(Boolean)),
    ].join(',')

    const payload = new URLSearchParams()
    payload.append('comment', rsvpComment.trim())
    payload.append('guestCount', String(preparedGuests.length))
    payload.append('guestName', preparedGuests.map((guest) => guest.name).join(', '))
    payload.append('attendance', legacyAttendance)
    payload.append('alcohol', legacyAlcohol)
    payload.append('hot', legacyHot)
    payload.append(
      'attendanceSummary',
      preparedGuests.map((guest) => `${guest.name}: ${guest.attendance}`).join(' | ')
    )
    payload.append(
      'alcoholSummary',
      preparedGuests.map((guest) => `${guest.name}: ${guest.alcohol}`).join(' | ')
    )
    payload.append(
      'hotSummary',
      preparedGuests.map((guest) => `${guest.name}: ${guest.hot}`).join(' | ')
    )
    payload.append('guestsJson', JSON.stringify(preparedGuests))

    try {
      setRsvpStatus('submitting')
      await fetch(RSVP_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
        body: payload.toString(),
      })
      form.reset()
      setRsvpComment('')
      setGuests([createGuest(1)])
      nextGuestIdRef.current = 2
      setRsvpStatus('success')
    } catch {
      setRsvpStatus('error')
    }
  }

  useEffect(() => {
    if (rsvpStatus !== 'success') return
    const t = window.setTimeout(() => {
      closingWaitSectionRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }, 0)
    return () => window.clearTimeout(t)
  }, [rsvpStatus])

  return (
    <>
      <header className="hero">
        <div className="hero-bg">
          <div
            className="hero-bg-img"
            style={{ backgroundImage: `url(${couplePhoto})` }}
            aria-hidden
          />
          <div className="hero-bg-gradient" aria-hidden />
        </div>
        <div className="hero-content">
          <div>
            <h1 className="hero-names">
              <span className="hero-name-part hero-name-part--maxim">Максим</span>
              <span className="hero-names-connector hero-name-part hero-name-part--and">и</span>
              <span className="hero-name-part hero-name-part--anastasia">Анастасия</span>
            </h1>
         {/* <p className="hero-date">08 08 26</p>*/}
          </div>
        </div>
      </header>

      <section className="dark">
        <div
          className={`intro-spacer intro-date-block ${introDateVisible ? 'intro-date-block--visible' : ''}`}
          ref={introDateRef}
          aria-hidden
        >
          <img src={sticker7} alt="" className="intro-date-sticker" />
          <img src={sticker14} alt="" className="timing-sticker15" />
          <span className="intro-date-pair intro-date-pair--1">08</span>
          <span className="intro-date-pair intro-date-pair--2">08</span>
          <span className="intro-date-pair intro-date-pair--3">26</span>
        </div>
        <h2 className="section-title intro-title reveal-item" data-reveal-index="0">
          Дорогие родные и близкие!
        </h2>
        <p className="invitation-text reveal-item" data-reveal-index="1">
          {`Наша история любви продолжается,
и совсем скоро мы сделаем самый важный шаг — станем семьёй.
Мы будем очень рады, если вы будете рядом
и разделите с нами этот тёплый и счастливый день`}
        </p>
      </section>
<section className="timing-section">
  <div className="timing-wrap">
    <img src={timing} alt="timing" className="timing-img" />
    <img src={sticker14} alt="" className="timing-sticker14" />

    <div className="timing-day-overlay" aria-hidden>
      {timelineEvents.map((ev, index) => (
        <div
          className="timing-day-item reveal-item"
          data-reveal-index={`timing-${index}`}
          key={`${ev.time}-${index}`}
        >
          <div className="timing-day-time">{ev.time}</div>
          <div className="timing-day-title">{ev.title}</div>
          <div className="timing-day-desc">{ev.desc}</div>
          {index < timelineEvents.length - 1 && (
            <div className="timing-day-separator" aria-hidden />
          )}
        </div>
      ))}
    </div>
  </div>
  
</section>

      <section className="dark-alt location-section">
        <h2 className="section-title reveal-item" data-reveal-index="2">
          Location
        </h2>
        <p className="location-address reveal-item" data-reveal-index="3">
        Торжество состоится в прекрасном месте —
загородном комплексе «Мир у Озера»,
где среди природы, уюта и близких людей начнётся наша семейная история
         
        </p>
        <p className="location-address reveal-item" data-reveal-index="4">
Санкт-Петербург, Ленинградское шоссе, 81Б, д. Юкки
         
        </p>
        <div className="photo-block photo-block--location">
          <img src={location} alt="Максим и Анастасия" />
        </div>
        <a href="https://yandex.ru/maps/org/mir_u_ozera/81686524557/?ll=30.299750%2C60.110393&mode=search&sctx=ZAAAAAgBEAAaKAoSCfol4q3zEz5AEcFVnkDY501AEhIJj3IwmwDDvj8RB14td2aCoT8iBgABAgMEBSgKOABA05MKSAFqAnJ1nQHNzMw9oAEAqAEAvQGjZVNtwgEGjeWVp7ACggIU0LzQuNGAINGDINC%2B0LfQtdGA0LCKAgCSAgCaAgxkZXNrdG9wLW1hcHM%3D&sll=30.299750%2C60.110393&sspn=0.030041%2C0.008472&text=%D0%BC%D0%B8%D1%80%20%D1%83%20%D0%BE%D0%B7%D0%B5%D1%80%D0%B0&z=16" target="_blank" rel="noopener noreferrer" className="btn">
          посмотреть на карте
        </a>
      </section>

      <section className="dark-alt">
        <h2 className="section-title reveal-item" data-reveal-index="5">
          Dress code
        </h2>
        <div className="dress-code-stickers">
          {dressCodeStickers.map((item, index) => (
            <img key={index} src={item} alt={`Стикер dress code ${index + 1}`} />
          ))}
        </div>
        <p className="invitation-text reveal-item" data-reveal-index="6">
        Мы будем рады, если вы поддержите стиль нашего праздника и выберете образы в стиле Total Black

        </p>
        <p className="invitation-text reveal-item" data-reveal-index="7">
        По желанию можно добавить изящный красный акцент — маленькая деталь, которая сделает Ваш образ особенным
        </p>
        <p className="invitation-text reveal-item" data-reveal-index="8">
        Для нас белый цвет в этот день особенно важен и символичен. Будем благодарны, если вы оставите его для наших образов
        </p>
      </section>

      <section className="dark-alt">
        <h2 className="section-title reveal-item" data-reveal-index="9">Details</h2>
        <ul className="details-list reveal-item" data-reveal-index="10">
          <li>
            <span className="details-num">
            <img
                      src={heartSvg}
                      alt=""
                      className="timeline-love-heart-white"
                      width={30}
                      height={30}
                    />
            </span>
            <p>Чтобы наши руки были свободны для объятий, будем рады лёгким подаркам в конвертах — ваши тёплые пожелания помогут исполнить нашу заветную мечту</p>
          </li>
          <li>
            <span className="details-num">       
                   <img
                      src={heartSvg}
                      alt=""
                      className="timeline-love-heart-white"
                      width={30}
                      height={30}
                    /></span>
            {/*<p>Если хотите добавить особый штрих, возьмите бутылочку вашего любимого напитка с маленьким пожеланием, на какой повод нам её открыть</p>*/}
          <p>Вместо цветов нам будет особенно приятно получить бутылочку вашего любимого напитка. Добавьте к ней маленькое пожелание — на какой особенный момент нам стоит её открыть. Мы с радостью будем вспоминать вас в эти счастливые мгновения</p>
          </li>
          <li>
            <span className="details-num">    
                  <img
                      src={heartSvg}
                      alt=""
                      className="timeline-love-heart-white"
                      width={30}
                      height={30}
                    /></span>
            <p>Каждая деталь превратится в радостный момент, который мы разделим вместе</p>
          </li>
        </ul>
        <div className="photo-block">
          <img src={photo2} alt="Максим и Анастасия" />
        </div>
      </section>
      <section className="dark-alt">
        <h2 className="section-title reveal-item" data-reveal-index="11">
          Общий чат
        </h2>
        <p className="invitation-text reveal-item" data-reveal-index="12">
        Этот день станет историей, которую мы будем вспоминать снова и снова.
Присоединяйтесь к нашему чату ВКонтакте— там можно общаться, задавать вопросы,
делиться фотографиями и моментами, из которых вместе сложатся самые тёплые воспоминания
        </p>
        <a
          href="https://vk.me/join/V0YZJgjolJ3nWOue0g3vPIjgxDoumHRvPYM="
          target="_blank"
          rel="noopener noreferrer"
          className="btn"
        >
          присоединиться
        </a>
      </section>
      <section id="rsvp" className="dark-alt rsvp-section">
        <h2 className="section-title reveal-item" data-reveal-index="13">
          Анкета гостя
        </h2>
        <form
          className="rsvp-card rsvp-card--hearts"
          id="confirm"
          onSubmit={handleRsvpSubmit}
          style={{ '--rsvp-hearts-bg': `url(${heartsBg})` }}
        >
          <p className="rsvp-intro">
            Просим подтвердить своё присутствие
            <br />
            до 01.07.2026
          </p>

          <div className="rsvp-divider" />

          <div className="rsvp-guests">
            {guests.map((guest, index) => {
              const isNotAttending = guest.attendance === 'no'

              return (
                <div className="rsvp-guest-card" key={guest.id}>
                  <div className="rsvp-guest-header">
                    <h3 className="rsvp-guest-title">Гость {index + 1}</h3>
                    {guests.length > 1 && (
                      <button
                        className="rsvp-remove"
                        type="button"
                        onClick={() => {
                          removeGuest(guest.id)
                          setRsvpStatus('idle')
                        }}
                      >
                        Удалить
                      </button>
                    )}
                  </div>

                  <div className="rsvp-field">
                    <label className="rsvp-label" htmlFor={`guest-name-${guest.id}`}>
                      Имя и фамилия
                    </label>
                    <input
                      className="rsvp-input"
                      id={`guest-name-${guest.id}`}
                      type="text"
                      placeholder="Напишите имя гостя"
                      value={guest.name}
                      onChange={(event) => {
                        updateGuest(guest.id, () => ({ name: event.target.value }))
                        setRsvpStatus('idle')
                      }}
                    />
                  </div>

                  <fieldset className="rsvp-fieldset">
                    <legend className="rsvp-legend">Планируете ли присутствовать на свадьбе?</legend>
                    <label className="rsvp-option rsvp-option--radio">
                      <input
                        type="radio"
                        name={`attendance-${guest.id}`}
                        value="yes"
                        checked={guest.attendance === 'yes'}
                        onChange={() => {
                          updateGuest(guest.id, () => ({ attendance: 'yes' }))
                          setRsvpStatus('idle')
                        }}
                      />
                      <span>Да, с удовольствием!</span>
                    </label>
                    <label className="rsvp-option rsvp-option--radio">
                      <input
                        type="radio"
                        name={`attendance-${guest.id}`}
                        value="no"
                        checked={guest.attendance === 'no'}
                        onChange={() => {
                          updateGuest(guest.id, () => ({
                            attendance: 'no',
                            alcohol: [],
                            hot: '',
                          }))
                          setRsvpStatus('idle')
                        }}
                      />
                      <span>К сожалению, не смогу</span>
                    </label>
                  </fieldset>

                  <fieldset className={`rsvp-fieldset ${isNotAttending ? 'rsvp-fieldset--muted' : ''}`}>
                    <legend className="rsvp-legend">Что предпочитаете из алкоголя?</legend>
                    {alcoholOptions.map(([value, label]) => (
                      <label className="rsvp-option" key={value}>
                        <input
                          type="checkbox"
                          value={value}
                          checked={guest.alcohol.includes(value)}
                          disabled={isNotAttending}
                          onChange={(event) => {
                            updateGuest(guest.id, (currentGuest) => ({
                              alcohol: event.target.checked
                                ? [...currentGuest.alcohol, value]
                                : currentGuest.alcohol.filter((item) => item !== value),
                            }))
                            setRsvpStatus('idle')
                          }}
                        />
                        <span>{label}</span>
                      </label>
                    ))}
                  </fieldset>

                  <fieldset className={`rsvp-fieldset ${isNotAttending ? 'rsvp-fieldset--muted' : ''}`}>
                    <legend className="rsvp-legend">Что предпочитаете на горячее?</legend>
                    {hotOptions.map(([value, label]) => (
                      <label className="rsvp-option rsvp-option--radio" key={value}>
                        <input
                          type="radio"
                          name={`hot-${guest.id}`}
                          value={value}
                          checked={guest.hot === value}
                          disabled={isNotAttending}
                          onChange={() => {
                            updateGuest(guest.id, () => ({ hot: value }))
                            setRsvpStatus('idle')
                          }}
                        />
                        <span>{label}</span>
                      </label>
                    ))}
                  </fieldset>
                </div>
              )
            })}
          </div>

          <button
            className="rsvp-add"
            type="button"
            onClick={() => {
              addGuest()
              setRsvpStatus('idle')
            }}
          >
            + Добавить гостя
          </button>

          <div className="rsvp-field rsvp-field--last">
            <label className="rsvp-label" htmlFor="rsvp-comment">
              Комментарий
            </label>
            <textarea
              className="rsvp-input rsvp-textarea"
              id="rsvp-comment"
              placeholder="Например, сообщите об аллергии или других пожеланиях"
              value={rsvpComment}
              onChange={(event) => {
                setRsvpComment(event.target.value)
                setRsvpStatus('idle')
              }}
            />
          </div>

          <button className="rsvp-submit" type="submit" disabled={rsvpStatus === 'submitting'}>
            {rsvpStatus === 'submitting' ? 'Отправляем...' : 'Отправить'}
          </button>
          {rsvpStatus === 'validation_error' && (
            <p className="rsvp-status rsvp-status--error">
              Для каждого гостя заполните имя и отметьте, сможет ли он присутствовать.
            </p>
          )}
          {rsvpStatus === 'success' && (
            <p className="rsvp-status rsvp-status--success">
              Спасибо! Ваша анкета отправлена.
            </p>
          )}
          {rsvpStatus === 'error' && (
            <p className="rsvp-status rsvp-status--error">
              Не удалось отправить анкету. Попробуйте ещё раз.
            </p>
          )}
        </form>
      </section>



      <section ref={closingWaitSectionRef} className="dark-alt closing-section">
        <h2 className="section-title reveal-item" data-reveal-index="14">
          Ждём вас!
        </h2>
        <p className="closing-love-text" style={{ fontStyle: 'italic' }}>
          <span className="reveal-item closing-love-prefix" data-reveal-index="15">
            с любовью,
          </span>
          <br />
          <span className="closing-love-family">
            <span
              className="reveal-item closing-love-name closing-love-name--max"
              data-reveal-index="16"
            >
              Максим
            </span>
            <span
              className="reveal-item closing-love-name closing-love-name--and"
              data-reveal-index="17"
            >
              и
            </span>
            <span
              className="reveal-item closing-love-name closing-love-name--anastasia"
              data-reveal-index="18"
            >
              Анастасия
            </span>
          </span>
        </p>
        <div
          className={`closing-image ${isClosingImageVisible ? 'closing-image--visible' : ''}`}
          ref={closingImageRef}
        >
          <div className="closing-timer">
            <div className="closing-timer-title">До встречи осталось</div>
            <div className="closing-timer-grid">
              <div className="closing-timer-item">
                <span className="closing-timer-value">{countdown.months}</span>
                <span className="closing-timer-label">месяцев</span>
              </div>
              <div className="closing-timer-item">
                <span className="closing-timer-value">{countdown.days}</span>
                <span className="closing-timer-label">дней</span>
              </div>
              <div className="closing-timer-item">
                <span className="closing-timer-value">{countdown.hours}</span>
                <span className="closing-timer-label">часов</span>
              </div>
              <div className="closing-timer-item">
                <span className="closing-timer-value">{countdown.minutes}</span>
                <span className="closing-timer-label">минут</span>
              </div>
              <div className="closing-timer-item">
                <span className="closing-timer-value">{countdown.seconds}</span>
                <span className="closing-timer-label">секунд</span>
              </div>
            </div>
            <div className="closing-timer-date">08.08.2026 15:00</div>
          </div>
          <img src={glove} alt="" />
          <img src={sticker14} alt="" className="timing-sticker16" />
          
        </div>
      </section>
    </>
  )
}

export default App
