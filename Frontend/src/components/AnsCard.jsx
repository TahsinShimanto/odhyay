import "../styles/AnsCard.css";

const AnsCard = ({ details = [] }) => {
  return (
    <div>
      {details.map((detail, index) => {
        const {
          questionId,
          questionText,
          questionImage,
          type,
          options,
          selectedIndex,
          isCorrect,
          answerOrExplanationText,
          answerOrExplanationImage,
        } = detail;

        let selectedOption;
        if (options) {
          selectedOption = options[selectedIndex];
        }
        const correctOption = options?.find((opt) => opt.isCorrect);

        return (
          <div className="ans-card" key={questionId}>
            <div className="header">
              প্রশ্ন {index + 1}
              <div className={`ans-tag ${isCorrect ? "correct" : "wrong"}`}>
                {isCorrect ? "সঠিক" : "ভুল"}
              </div>
            </div>

            <div className="divider"></div>

            <div className="ques-section">
              <h3>{questionText}</h3>
              {questionImage ? <img src={questionImage} alt="" /> : null}

              <div className="explain-card">
                <div className={isCorrect ? "user-ans" : "user-ans wrong"}>
                  আপনার উত্তর:
                  <p>
                    {selectedOption
                      ? selectedOption.text
                      : "উত্তর দেওয়া হয়নি"}
                  </p>
                </div>

                {type === "mcq" && (
                  <div className="correct-ans">
                    সঠিক উত্তর:
                    <p>{correctOption ? correctOption.text : "N/A"}</p>
                  </div>
                )}

                <div className="divider"></div>

                {(answerOrExplanationText || answerOrExplanationImage) && (
                  <div className="detailed-explain">
                    বিস্তারিত ব্যাখ্যা:
                    {answerOrExplanationText && (
                      <p>{answerOrExplanationText}</p>
                    )}
                    {answerOrExplanationImage && (
                      <img src={answerOrExplanationImage} alt="" />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AnsCard;
