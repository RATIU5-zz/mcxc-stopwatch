import { Button, ButtonGroup, EditableText, H5, Intent } from "@blueprintjs/core";
import PopoverButton from "../UI/PopupButton";
import React, { useState } from "react";
import { conf } from "../../conf";
import useRecords from "../../hooks/use_record";
import useStopwatch from "../../hooks/use_stopwatch";
import { StopwatchProps } from "../../Types/stopwatch";
import { displayTime, randomId } from "../../util/functions";
import Record from "./Record";
import styles from "./Stopwatch.module.scss";
import { Classes } from "@blueprintjs/popover2";
import useCopyToClipboard from "../../hooks/use_copyToClipboard";
import useTimeout from "../../hooks/use_timeout";
import { useStore } from "../../store/store";

const Stopwatch: React.FunctionComponent<StopwatchProps> = React.memo((props) => {
	// console.log("RENDERING STOPWATCH COMPONENT");

	const dispatch = useStore(false)[1];

	const {
		records,
		add: addRecord,
		remove: removeRecord,
		clear: clearRecords,
		addAt: addRecordAt,
	} = useRecords();
	const {
		time: currentTime,
		start: startStopwatch,
		// pause: pauseStopwatch,
		reset: resetStopwatch,
		isRunning,
	} = useStopwatch();
	const copyToClipboard = useCopyToClipboard()[1];
	const [copied, setCopied] = useState(false);

	const startButtonHandler = () => {
		startStopwatch();
	};

	const resetCopyText = () => {
		setCopied(false);
	};
	// Timeout for copy text
	useTimeout(resetCopyText, copied ? 3000 : null);

	// const pauseButtonHandler = () => {
	// 	pauseStopwatch();
	// };
	const resetButtonHandler = () => {
		resetStopwatch();
		clearRecords();
		setCopied(false);
	};
	const recordButtonHandler = () => {
		dispatch("RECORD_MARK", props.id);
		if (isRunning)
			addRecord({
				id: randomId(),
				time: currentTime,
			});
	};
	const copyButtonHandler = () => {
		const copyDataToClipboard = async () => {
			let recordsStr = "";
			// const copiedRecords = records.forEach((e) => {
			// 	recordsStr += displayTime(e.time, conf.timeFormat) + "\n";
			// });

			if (await copyToClipboard(recordsStr)) {
				setCopied(true);
			}
		};

		copyDataToClipboard();
	};
	const closeButtonHandler = () => {
		console.log("CLOSE");
	};
	const removeRecordHandler = (id: string) => {
		removeRecord(id);
	};
	const addRecordHandler = (position: number) => {
		addRecordAt(position, { id: randomId(), time: 0 });
	};

	return (
		<div className={styles.container}>
			<header className={styles.header}>
				<div className={styles.header_titleBar}>
					<EditableText
						className={styles.header_titleBar_title}
						placeholder={props.id}
						selectAllOnFocus
					/>
					<span className={styles.space}></span>
					<Button
						onClick={closeButtonHandler}
						icon="cross"
						intent={Intent.DANGER}
						large
						minimal
						disabled
					/>
				</div>
				<div className={styles.header_timerBar}>
					<h4 className={styles.header_timeBar_counter}>{records.length} Total</h4>
					<span className={styles.space}></span>
					<Button
						onClick={copyButtonHandler}
						rightIcon="clipboard"
						intent={Intent.PRIMARY}
						disabled={records.length === 0}
						large
						minimal
					>
						{(copied && "Copied!") || "Copy"}
					</Button>
				</div>
			</header>
			<ul className={styles.record_list}>
				{records.map((r, i) => (
					<Record
						key={r.id}
						id={r.id}
						place={i + 1}
						time={r.time}
						onAdd={addRecordHandler}
						onRemove={removeRecordHandler}
					/>
				))}
			</ul>
			<footer className={styles.footer}>
				<h4 className={styles.footer_display}>
					{displayTime(currentTime, conf.timeFormat)}
				</h4>
				<ButtonGroup className={styles.footer_buttons} fill minimal>
					<Button
						onClick={startButtonHandler}
						className={styles.footer_buttons_button}
						intent={Intent.SUCCESS}
						disabled={isRunning}
						text={<p className={styles.footer_button_text}>{"Start"}</p>}
					/>
					<Button
						onClick={recordButtonHandler}
						className={styles.footer_buttons_button}
						intent={Intent.PRIMARY}
						disabled={!isRunning}
						text={<p className={styles.footer_button_text}>Record</p>}
					/>
					<PopoverButton
						usePopup={records.length !== 0}
						button={
							<Button
								onClick={records.length === 0 ? resetButtonHandler : undefined}
								className={styles.footer_buttons_button}
								intent={Intent.DANGER}
								text={<p className={styles.footer_button_text}>Reset</p>}
							/>
						}
						popover={
							<div key="text">
								<H5>Confirm deletion</H5>
								<p>
									Are you sure you want to delete{" "}
									{records.length === 1 && "this record"}
									{records.length > 1 && `all ${records.length} records`}?
								</p>
								<div
									style={{
										display: "flex",
										justifyContent: "flex-end",
										marginTop: 15,
									}}
								>
									<Button
										className={Classes.POPOVER2_DISMISS}
										style={{ marginRight: 10 }}
										large
									>
										Cancel
									</Button>
									<Button
										onClick={resetButtonHandler}
										intent={Intent.DANGER}
										className={Classes.POPOVER2_DISMISS}
										large
									>
										Delete
									</Button>
								</div>
							</div>
						}
					/>
				</ButtonGroup>
			</footer>
		</div>
	);
});

export default Stopwatch;
