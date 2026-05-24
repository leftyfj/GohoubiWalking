import './SelectReward.css'

type SelectRewardProps = {
    reward: string;
    setReward: (value: string) => void;
};
export const SelectReward = (props: SelectRewardProps) => {
    const { reward, setReward } = props;
    return (
        <select
            className="reward-select"
            value={reward}
            onChange={(e) => setReward(e.target.value)}
        >
            <option value="" disabled>
                ご褒美を選択
            </option>
            <option value="sweets">甘味・スイーツ</option>

            <option value="ramen">ラーメン</option>
        </select>
    );
};
